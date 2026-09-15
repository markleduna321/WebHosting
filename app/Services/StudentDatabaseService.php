<?php

namespace App\Services;

use App\Exceptions\DatabaseProvisioningException;
use App\Models\StudentDatabase;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Provisions real MySQL schemas for students.
 *
 * This is the only class in the application permitted to issue DDL. MySQL cannot
 * parameterise identifiers, so every value interpolated below is generated here
 * from a fixed alphabet and re-validated against a whitelist immediately before
 * the statement is built. Nothing derived from raw user input reaches a query.
 */
class StudentDatabaseService
{
    private const IDENTIFIER_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

    private const MAX_DB_NAME_LENGTH = 64;
    private const MAX_DB_USER_LENGTH = 32;

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException|DatabaseProvisioningException
     */
    public function createForUser(User $user, array $data): StudentDatabase
    {
        $this->assertWithinQuota($user);

        $name = (string) $data['name'];
        $dbName = $this->buildDatabaseName($user, $name);
        $dbUser = $this->generateUserName($user);
        $password = (string) $data['password'];

        $database = $user->studentDatabases()->create([
            'label' => $name,
            'db_name' => $dbName,
            'db_user' => $dbUser,
            'db_password' => $password,
            'host' => (string) config('hosting.databases.host'),
            'port' => (int) config('hosting.databases.port'),
            'quota_mb' => (int) config('hosting.databases.quota_mb'),
            'status' => StudentDatabase::STATUS_PROVISIONING,
        ]);

        try {
            $this->provision($dbName, $dbUser, $password);
        } catch (Throwable $e) {
            // A driver error embeds the failing SQL, which would put the password in the log.
            Log::error('Student database provisioning failed.', [
                'user_id' => $user->id,
                'db_name' => $dbName,
                'exception' => $this->redact($e->getMessage(), $password),
            ]);

            $this->rollback($dbName, $dbUser);
            $database->delete();

            throw new DatabaseProvisioningException();
        }

        $database->update(['status' => StudentDatabase::STATUS_ACTIVE]);

        return $database->fresh();
    }

    /**
     * Drops the schema and its account, then removes the record.
     *
     * @throws DatabaseProvisioningException
     */
    public function destroy(StudentDatabase $database): void
    {
        try {
            $this->rollback($database->db_name, $database->db_user, silent: false);
        } catch (Throwable $e) {
            Log::error('Student database teardown failed.', [
                'db_name' => $database->db_name,
                'exception' => $this->redact($e->getMessage()),
            ]);

            throw new DatabaseProvisioningException('The database could not be removed.');
        }

        $database->delete();
    }

    /**
     * Refreshes cached disk usage for a set of databases in a single query.
     *
     * @param  Collection<int, StudentDatabase>  $databases
     */
    public function refreshUsage(Collection $databases): void
    {
        if ($databases->isEmpty()) {
            return;
        }

        $names = $databases->pluck('db_name')->all();
        $placeholders = implode(',', array_fill(0, count($names), '?'));

        try {
            $rows = $this->connection()->select(
                'SELECT table_schema AS schema_name, COALESCE(SUM(data_length + index_length), 0) AS bytes'
                ." FROM information_schema.TABLES WHERE table_schema IN ({$placeholders}) GROUP BY table_schema",
                $names
            );
        } catch (Throwable $e) {
            Log::warning('Could not read student database usage.', ['exception' => $e->getMessage()]);

            return;
        }

        $usage = collect($rows)->keyBy('schema_name');

        foreach ($databases as $database) {
            $bytes = (int) ($usage->get($database->db_name)->bytes ?? 0);

            if ($bytes !== $database->size_bytes) {
                $database->forceFill(['size_bytes' => $bytes])->save();
            }
        }
    }

    public function connectionString(StudentDatabase $database): string
    {
        return sprintf(
            'mysql://%s:%s@%s:%d/%s',
            $database->db_user,
            rawurlencode($database->db_password),
            $database->host,
            $database->port,
            $database->db_name
        );
    }

    /**
     * Yields the schema as SQL, one statement block at a time.
     *
     * Reads go through the student's own least-privilege account, never the admin
     * connection, so an export can only ever reach data they already own.
     *
     * @return \Generator<string>
     */
    public function streamDump(StudentDatabase $database): \Generator
    {
        $connectionName = 'student_dump_'.$database->id;

        config(["database.connections.{$connectionName}" => array_merge(
            (array) config('database.connections.mysql'),
            [
                'database' => $this->assertSafeIdentifier($database->db_name),
                'username' => $this->assertSafeIdentifier($database->db_user),
                'password' => $database->db_password,
                'host' => $database->host,
                'port' => $database->port,
            ],
        )]);

        $connection = DB::connection($connectionName);

        try {
            yield "-- Export of {$database->db_name}\n";
            yield '-- Generated '.now()->toDateTimeString()." UTC\n\n";
            yield "SET FOREIGN_KEY_CHECKS=0;\n\n";

            foreach ($this->tableNames($connection) as $table) {
                $quoted = $this->quoteIdentifier($table);
                $definition = (array) ($connection->select("SHOW CREATE TABLE {$quoted}")[0] ?? []);
                $ddl = $definition['Create Table'] ?? $definition['Create View'] ?? null;

                if ($ddl === null) {
                    continue;
                }

                yield "DROP TABLE IF EXISTS {$quoted};\n";
                yield $ddl.";\n\n";
                yield from $this->tableRows($connection, $quoted);
            }

            yield "SET FOREIGN_KEY_CHECKS=1;\n";
        } finally {
            DB::purge($connectionName);
        }
    }

    /**
     * @return array<int, string>
     */
    private function tableNames(\Illuminate\Database\Connection $connection): array
    {
        $rows = $connection->select(
            'SELECT table_name AS name FROM information_schema.TABLES'
            .' WHERE table_schema = DATABASE() ORDER BY table_name'
        );

        return array_map(static fn ($row) => (string) $row->name, $rows);
    }

    /**
     * @return \Generator<string>
     */
    private function tableRows(\Illuminate\Database\Connection $connection, string $quotedTable): \Generator
    {
        $chunk = 500;
        $offset = 0;

        do {
            $rows = $connection->select("SELECT * FROM {$quotedTable} LIMIT {$chunk} OFFSET {$offset}");

            foreach ($rows as $row) {
                $row = (array) $row;
                $columns = implode(', ', array_map($this->quoteIdentifier(...), array_keys($row)));
                $values = implode(', ', array_map(
                    fn ($value) => $this->literal($connection, $value),
                    array_values($row)
                ));

                yield "INSERT INTO {$quotedTable} ({$columns}) VALUES ({$values});\n";
            }

            $offset += $chunk;
        } while (count($rows) === $chunk);

        yield "\n";
    }

    private function literal(\Illuminate\Database\Connection $connection, mixed $value): string
    {
        if ($value === null) {
            return 'NULL';
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }

        $value = (string) $value;

        // Binary columns cannot round-trip through a quoted string literal.
        if (preg_match('//u', $value) !== 1) {
            return '0x'.bin2hex($value);
        }

        return $connection->getPdo()->quote($value);
    }

    private function quoteIdentifier(string $identifier): string
    {
        return '`'.str_replace('`', '``', $identifier).'`';
    }

    /** Driver exceptions embed the failing SQL, so credentials are stripped before logging. */
    private function redact(string $message, ?string $password = null): string
    {
        if ($password !== null && $password !== '') {
            $message = str_replace($password, '[redacted]', $message);
        }

        return (string) preg_replace(
            "/IDENTIFIED BY '[^']*'/i",
            "IDENTIFIED BY '[redacted]'",
            $message
        );
    }

    /**
     * Creates the schema, a dedicated account, and a grant scoped to that schema only.
     */
    private function provision(string $dbName, string $dbUser, string $password): void
    {
        $dbName = $this->assertSafeIdentifier($dbName);
        $dbUser = $this->assertSafeIdentifier($dbUser);
        $password = $this->assertSafePassword($password);
        $grantHost = $this->assertSafeHost((string) config('hosting.databases.grant_host'));
        $charset = $this->assertSafeIdentifier((string) config('hosting.databases.charset'));
        $collation = $this->assertSafeIdentifier((string) config('hosting.databases.collation'));

        $connection = $this->connection();

        $connection->unprepared(
            "CREATE DATABASE `{$dbName}` CHARACTER SET {$charset} COLLATE {$collation}"
        );

        // Validated above; escaped again so the literal cannot be terminated even if that gate ever loosens.
        $escapedPassword = str_replace(['\\', "'"], ['\\\\', "\\'"], $password);

        $connection->unprepared(
            "CREATE USER '{$dbUser}'@'{$grantHost}' IDENTIFIED BY '{$escapedPassword}'"
        );

        // Scoped to this one schema: never *.*, never WITH GRANT OPTION.
        $connection->unprepared(
            "GRANT ALL PRIVILEGES ON `{$dbName}`.* TO '{$dbUser}'@'{$grantHost}'"
        );

        $connection->unprepared('FLUSH PRIVILEGES');
    }

    private function rollback(string $dbName, string $dbUser, bool $silent = true): void
    {
        $grantHost = $this->assertSafeHost((string) config('hosting.databases.grant_host'));

        try {
            $dbName = $this->assertSafeIdentifier($dbName);
            $dbUser = $this->assertSafeIdentifier($dbUser);

            $connection = $this->connection();
            $connection->unprepared("DROP DATABASE IF EXISTS `{$dbName}`");
            $connection->unprepared("DROP USER IF EXISTS '{$dbUser}'@'{$grantHost}'");
            $connection->unprepared('FLUSH PRIVILEGES');
        } catch (Throwable $e) {
            if (! $silent) {
                throw $e;
            }

            Log::warning('Student database rollback was incomplete.', [
                'db_name' => $dbName,
                'exception' => $this->redact($e->getMessage()),
            ]);
        }
    }

    /** @throws ValidationException */
    private function assertWithinQuota(User $user): void
    {
        $limit = (int) config('hosting.databases.max_per_user');

        if ($user->studentDatabases()->count() >= $limit) {
            throw ValidationException::withMessages([
                'name' => "Your plan allows up to {$limit} databases. Delete one before creating another.",
            ]);
        }
    }

    private function buildDatabaseName(User $user, string $name): string
    {
        $prefix = $this->assertSafeIdentifier((string) config('hosting.databases.prefix'));
        $candidate = $prefix.'_'.$user->id.'_'.$name;

        if (strlen($candidate) > self::MAX_DB_NAME_LENGTH) {
            throw ValidationException::withMessages([
                'name' => 'That name is too long. Try something shorter.',
            ]);
        }

        // Renaming what the student typed would be worse than telling them it is taken.
        if ($this->nameIsTaken($candidate)) {
            throw ValidationException::withMessages([
                'name' => 'You already have a database with that name.',
            ]);
        }

        return $candidate;
    }

    private function generateUserName(User $user): string
    {
        $prefix = $this->assertSafeIdentifier((string) config('hosting.databases.prefix'));
        $base = substr($prefix.$user->id.'_', 0, self::MAX_DB_USER_LENGTH - 8);

        do {
            $candidate = $base.$this->randomString(self::IDENTIFIER_ALPHABET, 8);
        } while (StudentDatabase::where('db_user', $candidate)->exists());

        return $candidate;
    }

    /** Checks our own records and the live server, so an orphaned schema is never reused. */
    private function nameIsTaken(string $candidate): bool
    {
        if (StudentDatabase::where('db_name', $candidate)->exists()) {
            return true;
        }

        $existing = $this->connection()->select(
            'SELECT 1 FROM information_schema.SCHEMATA WHERE schema_name = ? LIMIT 1',
            [$candidate]
        );

        return $existing !== [];
    }

    private function connection(): \Illuminate\Database\Connection
    {
        return DB::connection((string) config('hosting.databases.connection'));
    }

    private function randomString(string $alphabet, int $length): string
    {
        $max = strlen($alphabet) - 1;
        $value = '';

        for ($i = 0; $i < $length; $i++) {
            $value .= $alphabet[random_int(0, $max)];
        }

        return $value;
    }

    /**
     * The DDL boundary. An identifier that fails here aborts rather than being sanitised.
     */
    private function assertSafeIdentifier(string $value): string
    {
        if (preg_match(StudentDatabase::IDENTIFIER_PATTERN, $value) !== 1) {
            throw new \InvalidArgumentException('Refusing to build a statement with an unsafe identifier.');
        }

        return $value;
    }

    private function assertSafePassword(string $value): string
    {
        if (preg_match(StudentDatabase::PASSWORD_PATTERN, $value) !== 1) {
            throw new \InvalidArgumentException('Refusing to build a statement with an unsafe password.');
        }

        return $value;
    }

    private function assertSafeHost(string $value): string
    {
        if (preg_match('/^[A-Za-z0-9._%-]{1,60}$/', $value) !== 1) {
            throw new \InvalidArgumentException('Refusing to build a statement with an unsafe grant host.');
        }

        return $value;
    }
}
