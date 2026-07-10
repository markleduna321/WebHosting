<?php

use App\Models\Session;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('session.{sessionId}', function (?User $user, string $sessionId) {
    if (! $user) {
        return false;
    }

    $session = Session::query()
        ->with('classroom')
        ->whereKey($sessionId)
        ->where('status', 'active')
        ->first();

    if (! $session) {
        return false;
    }

    return [
        'id' => (string) $user->id,
        'name' => $user->name,
        'role' => $session->owner_id === $user->id ? 'teacher' : 'learner',
        'session_id' => $session->id,
        'classroom_id' => $session->classroom_id,
    ];
});