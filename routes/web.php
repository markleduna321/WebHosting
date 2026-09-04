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
    Route::get('/site-domain', fn () => Inertia::render('site-domain/site/page'))->name('site-domain');
    Route::get('/site-domain/domains', fn () => Inertia::render('site-domain/domain/page'))->name('site-domain.domains');
    Route::get('/site-domain/git-sync', fn () => Inertia::render('site-domain/git-sync/page'))->name('site-domain.git-sync');
    Route::get('/files-database', fn () => Inertia::render('file-database/file-manager/page'))->name('files-database');
    Route::get('/files-database/databases', fn () => Inertia::render('file-database/databases/page'))->name('files-database.databases');
    Route::get('/files-database/environment', fn () => Inertia::render('file-database/environment/page'))->name('files-database.environment');
    Route::get('/account-billing', fn () => Inertia::render('account-billing/subscription/page'))->name('account-billing');
    Route::get('/account-billing/payment-methods', fn () => Inertia::render('account-billing/payment-methods/page'))->name('account-billing.payment-methods');
    Route::get('/account-billing/referrals', fn () => Inertia::render('account-billing/referrals/page'))->name('account-billing.referrals');
    Route::get('/account-billing/profile', fn () => Inertia::render('account-billing/profile/page'))->name('account-billing.profile');
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
