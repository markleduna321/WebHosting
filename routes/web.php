<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home-page/page', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard/page');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/hosting', fn () => Inertia::render('hosting/page'))->name('hosting');
    Route::get('/websites', fn () => Inertia::render('websites/page'))->name('websites');
    Route::get('/websites/files', fn () => Inertia::render('websites/files/page'))->name('websites.files');
    Route::get('/websites/databases', fn () => Inertia::render('websites/databases/page'))->name('websites.databases');
    Route::get('/domains', fn () => Inertia::render('domains/page'))->name('domains');
    Route::get('/deployments', fn () => Inertia::render('deployments/page'))->name('deployments');
    Route::get('/billing', fn () => Inertia::render('billing/page'))->name('billing');
    Route::get('/knowledge-base', fn () => Inertia::render('knowledge-base/page'))->name('knowledge-base');
    Route::get('/support', fn () => Inertia::render('support/page'))->name('support');
    Route::get('/account/settings', fn () => Inertia::render('account/settings/page'))->name('account.settings');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
