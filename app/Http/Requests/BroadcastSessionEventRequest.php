<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BroadcastSessionEventRequest extends FormRequest
{
    private const ALLOWED_EVENTS = [
        'HANDSHAKE_ACK',
        'SLIDE_START',
        'SLIDE_CHANGE',
        'PRESENTATION_ENDED',
        'VIDEO_SESSION_READY',
        'VIDEO_SESSION_ENDED',
        'PARTICIPANT_UPDATE',
        'WEBRTC_JOIN',
        'WEBRTC_OFFER',
        'WEBRTC_ANSWER',
        'WEBRTC_ICE',
        'MUTE_COMMAND',
        'CALLED_ON',
        'CHAT_MESSAGE',
        'HAND_UPDATE',
    ];

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'event' => ['required', 'string', 'max:255', Rule::in(self::ALLOWED_EVENTS)],
            'data' => ['nullable', 'array'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $event = $this->string('event')->value();
            $data = $this->input('data', []);

            if (! is_array($data)) {
                return;
            }

            $requiredKeysByEvent = [
                'WEBRTC_JOIN' => ['from', 'name', 'sessionId'],
                'WEBRTC_OFFER' => ['from', 'to', 'sdp', 'type'],
                'WEBRTC_ANSWER' => ['from', 'to', 'sdp', 'type'],
                'WEBRTC_ICE' => ['from', 'to', 'candidate'],
                'MUTE_COMMAND' => ['target', 'action'],
                'CALLED_ON' => ['target'],
            ];

            foreach ($requiredKeysByEvent[$event] ?? [] as $key) {
                if (! array_key_exists($key, $data)) {
                    $validator->errors()->add('data', "The {$key} field is required for {$event} events.");
                }
            }

            if ($event === 'MUTE_COMMAND' && array_key_exists('action', $data) && ! in_array($data['action'], ['mute', 'unmute'], true)) {
                $validator->errors()->add('data', 'The action field must be mute or unmute for MUTE_COMMAND events.');
            }
        });
    }
}