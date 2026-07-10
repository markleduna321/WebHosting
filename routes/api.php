<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\PublicClassroomController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\QuizSubmissionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HandController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are intended for RTK Query endpoints and must return JSON.
|
*/

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user', [UserController::class, 'update']);

    Route::get('/classrooms/mine', [ClassroomController::class, 'index']);
    Route::post('/classrooms', [ClassroomController::class, 'store']);
    Route::put('/classrooms/{classroom}', [ClassroomController::class, 'update']);
    Route::delete('/classrooms/{classroom}', [ClassroomController::class, 'destroy']);
    Route::post('/classrooms/{classroom}/materials', [MaterialController::class, 'store']);
    Route::delete('/classrooms/{classroom}/materials/{material}', [MaterialController::class, 'destroy']);

    Route::post('/sessions', [SessionController::class, 'store']);
    Route::get('/sessions/{session}', [SessionController::class, 'show']);
    Route::post('/sessions/{session}/end', [SessionController::class, 'end']);
    Route::get('/sessions/{session}/participants', [SessionController::class, 'participants']);
    Route::post('/sessions/{session}/broadcast', [SessionController::class, 'broadcast'])->middleware('throttle:broadcast');
    Route::post('/sessions/{session}/quiz/submit', [QuizSubmissionController::class, 'store']);
    Route::get('/sessions/{session}/quiz/results', [QuizSubmissionController::class, 'results']);
    Route::get('/sessions/{session}/chat', [ChatController::class, 'index']);
    Route::post('/sessions/{session}/chat', [ChatController::class, 'store']);
    Route::post('/sessions/{session}/hand/raise', [HandController::class, 'raise']);
    Route::post('/sessions/{session}/hand/lower', [HandController::class, 'lower']);
    Route::post('/sessions/{session}/hand/call', [HandController::class, 'call']);
});

Route::get('/classrooms', [PublicClassroomController::class, 'index']);
Route::get('/classrooms/{classroom}', [PublicClassroomController::class, 'show']);
Route::get('/classrooms/{classroom}/materials', [PublicClassroomController::class, 'materials']);
Route::get('/classrooms/{classroom}/active-session', [PublicClassroomController::class, 'activeSession']);

Route::middleware(['web', 'guest'])->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});
