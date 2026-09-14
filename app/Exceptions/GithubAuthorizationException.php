<?php

namespace App\Exceptions;

use Exception;

/** Thrown when GitHub rejects the stored token and the user must reconnect. */
class GithubAuthorizationException extends Exception
{
    public function __construct(string $message = 'GitHub authorization is no longer valid.')
    {
        parent::__construct($message);
    }
}
