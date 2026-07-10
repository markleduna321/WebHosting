<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('classroom-browser/page');
});

Route::get('/browse/classrooms', function () {
    return Inertia::render('classroom-browser/page');
})->name('classroom-browser.index');

Route::get('/dashboard', function () {
    return Inertia::render('classrooms/page');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/classrooms', function () {
        return Inertia::render('classrooms/page');
    })->name('classrooms.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
