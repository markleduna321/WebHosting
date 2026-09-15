<?php

namespace App\Exceptions;

use Exception;

/** Thrown when the MySQL server rejects a provisioning statement. Never surfaces the raw SQL error. */
class DatabaseProvisioningException extends Exception
{
    public function __construct(string $message = 'The database could not be provisioned.')
    {
        parent::__construct($message);
    }
}
