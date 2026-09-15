<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GithubRepositoryController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\StudentDatabaseController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WebsiteController;
use App\Http\Controllers\Api\WebsiteFileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are intended for RTK Query endpoints and must return JSON.
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'me']);
    Route::put('/user', [UserController::class, 'update']);

    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);

    Route::get('/github/repositories', [GithubRepositoryController::class, 'index'])
        ->middleware('throttle:30,1')
        ->name('api.github.repositories');

    Route::get('/websites', [WebsiteController::class, 'index'])->name('api.websites.index');
    Route::post('/websites', [WebsiteController::class, 'store'])
        ->middleware('throttle:30,1')
        ->name('api.websites.store');

    Route::get('/websites/{website}/files', [WebsiteFileController::class, 'index'])
        ->middleware('throttle:60,1')
        ->name('api.websites.files');

    Route::post('/websites/{website}/redeploy', [WebsiteController::class, 'redeploy'])
        ->middleware('throttle:10,1')
        ->name('api.websites.redeploy');

    Route::delete('/websites/{website}', [WebsiteController::class, 'destroy'])
        ->name('api.websites.destroy');

    Route::get('/databases', [StudentDatabaseController::class, 'index'])
        ->name('api.databases.index');
    Route::post('/databases', [StudentDatabaseController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('api.databases.store');
    Route::get('/databases/{database}/credentials', [StudentDatabaseController::class, 'credentials'])
        ->middleware('throttle:20,1')
        ->name('api.databases.credentials');
    Route::get('/databases/{database}/export', [StudentDatabaseController::class, 'export'])
        ->middleware('throttle:5,1')
        ->name('api.databases.export');
    Route::delete('/databases/{database}', [StudentDatabaseController::class, 'destroy'])
        ->middleware('throttle:20,1')
        ->name('api.databases.destroy');
});
