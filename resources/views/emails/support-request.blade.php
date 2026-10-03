<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>New support request</title></head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border-radius:12px;padding:24px;">
<tr><td>
<p style="margin:0;color:#0e7490;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Caleho Support</p>
<h1 style="margin:8px 0 20px;font-size:22px;">Human support requested</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#64748b;width:130px;">Reference</td><td style="padding:8px 0;font-weight:bold;">{{ $reference }}</td></tr>
<tr><td style="padding:8px 0;color:#64748b;">Customer</td><td style="padding:8px 0;">{{ $conversation->user?->name ?? 'Guest' }}</td></tr>
<tr><td style="padding:8px 0;color:#64748b;">Reply email</td><td style="padding:8px 0;">{{ $conversation->user?->email ?? $conversation->guest_email }}</td></tr>
<tr><td style="padding:8px 0;color:#64748b;">Conversation</td><td style="padding:8px 0;">{{ $conversation->created_at?->toIso8601String() }}</td></tr>
</table>
<h2 style="margin:24px 0 10px;font-size:15px;">Transcript</h2>
@foreach ($messages as $message)
<div style="margin:0 0 10px;padding:12px;border-radius:8px;background:#f8fafc;">
<p style="margin:0 0 5px;font-size:11px;font-weight:bold;color:#64748b;text-transform:uppercase;">{{ $message->role === 'user' ? 'Customer' : 'Caleho assistant' }}</p>
<p style="margin:0;font-size:14px;line-height:21px;white-space:pre-wrap;">{{ $message->content }}</p>
</div>
@endforeach
</td></tr></table>
</td></tr></table>
</body></html>
