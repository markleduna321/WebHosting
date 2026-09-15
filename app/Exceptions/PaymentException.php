<?php

namespace App\Exceptions;

use Exception;

/** Thrown when PayMongo rejects a request. Never carries the raw gateway response. */
class PaymentException extends Exception
{
    public function __construct(string $message = 'We could not start that payment. Please try again.')
    {
        parent::__construct($message);
    }
}
