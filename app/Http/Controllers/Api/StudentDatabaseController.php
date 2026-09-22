<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\DatabaseProvisioningException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentDatabaseRequest;
use App\Http\Resources\StudentDatabaseResource;
use App\Models\StudentDatabase;
use App\Services\StudentDatabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentDatabaseController extends Controller
{
    public function __construct(private readonly StudentDatabaseService $databases) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', StudentDatabase::class);

        // Scoped to the relation, so ownership is never inferred from client input.
        $databases = $request->user()
            ->studentDatabases()
            ->latest()
            ->get();

        $this->databases->refreshUsage($databases);

        $plan = $request->user()->activeSubscription?->plan;

        return StudentDatabaseResource::collection($databases)
            ->additional([
                'meta' => [
                    'max_per_user' => $plan?->max_databases ?? (int) config('hosting.databases.max_per_user'),
                    'quota_mb' => $plan?->db_size_mb ?? (int) config('hosting.databases.quota_mb'),
                    'phpmyadmin_url' => (string) config('hosting.databases.phpmyadmin_url'),
                    // Lets the create form preview the schema name the server will build.
                    'name_prefix' => config('hosting.databases.prefix').'_'.$request->user()->id.'_',
                ],
            ])
            ->response();
    }

    public function store(StoreStudentDatabaseRequest $request): JsonResponse
    {
        try {
            $database = $this->databases->createForUser($request->user(), $request->validated());
        } catch (DatabaseProvisioningException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 'provisioning_failed',
            ], 500);
        }

        return (new StudentDatabaseResource($database))->response()->setStatusCode(201);
    }

    public function credentials(StudentDatabase $database): JsonResponse
    {
        $this->authorize('view', $database);

        return response()->json([
            'data' => [
                'uuid' => $database->uuid,
                'host' => $database->host,
                'port' => $database->port,
                'database' => $database->db_name,
                'username' => $database->db_user,
                'password' => $database->db_password,
                'connection_string' => $this->databases->connectionString($database),
            ],
        ]);
    }

    public function destroy(StudentDatabase $database): JsonResponse
    {
        $this->authorize('delete', $database);

        try {
            $this->databases->destroy($database);
        } catch (DatabaseProvisioningException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 'teardown_failed',
            ], 500);
        }

        return response()->json(null, 204);
    }

    public function export(StudentDatabase $database): Response
    {
        $this->authorize('view', $database);

        if ($database->status !== StudentDatabase::STATUS_ACTIVE) {
            return response()->json([
                'message' => 'This database is not ready to export yet.',
                'code' => 'database_not_ready',
            ], 409);
        }

        $filename = $database->db_name.'-'.now()->format('Ymd-His').'.sql';

        return response()->streamDownload(function () use ($database) {
            foreach ($this->databases->streamDump($database) as $chunk) {
                echo $chunk;
                flush();
            }
        }, $filename, ['Content-Type' => 'application/sql']);
    }
}
