<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GithubRepositoryController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
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
});
