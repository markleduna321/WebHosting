<?php

namespace App\Exceptions;

use Exception;

/** Thrown when a repository archive is unsafe or exceeds the configured limits. */
class RepositoryExtractionException extends Exception {}
