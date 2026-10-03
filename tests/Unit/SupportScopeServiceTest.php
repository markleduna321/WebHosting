<?php

namespace Tests\Unit;

use App\Services\SupportScopeService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SupportScopeServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openai.key' => 'test-key']);
        Http::preventStrayRequests();
    }

    public function test_code_debugging_request_is_classified_out_of_scope(): void
    {
        $result = app(SupportScopeService::class)->classify('Can you fix this PHP error in my code?');

        $this->assertSame(SupportScopeService::OUT_OF_SCOPE, $result);
        Http::assertNothingSent();
    }

    public function test_other_code_help_wording_is_stopped_before_model_call(): void
    {
        $result = app(SupportScopeService::class)->classify('Please review my JavaScript function.');

        $this->assertSame(SupportScopeService::OUT_OF_SCOPE, $result);
        Http::assertNothingSent();
    }

    public function test_indirect_request_for_code_help_is_stopped_before_model_call(): void
    {
        $result = app(SupportScopeService::class)->classify('Can you help me with my code?');

        $this->assertSame(SupportScopeService::OUT_OF_SCOPE, $result);
        Http::assertNothingSent();
    }

    public function test_classifier_refuses_code_debugging_request(): void
    {
        Http::fake([
            'api.openai.com/*' => Http::response([
                'choices' => [['message' => ['content' => '{"scope":"out_of_scope"}']]],
            ]),
        ]);

        $result = app(SupportScopeService::class)->classify('Can you provide general programming advice?');

        $this->assertSame(SupportScopeService::OUT_OF_SCOPE, $result);
        Http::assertSent(fn ($request) => str_contains(
            $request->data()['messages'][0]['content'],
            'Always classify as out_of_scope: writing, explaining, reviewing, debugging, or fixing code',
        ));
    }

    public function test_caleho_support_question_is_allowed_by_classifier(): void
    {
        Http::fake([
            'api.openai.com/*' => Http::response([
                'choices' => [['message' => ['content' => '{"scope":"in_scope"}']]],
            ]),
        ]);

        $result = app(SupportScopeService::class)->classify('Where can I download my paid invoice?');

        $this->assertSame(SupportScopeService::IN_SCOPE, $result);
    }

    public function test_missing_openai_key_fails_closed(): void
    {
        config(['services.openai.key' => '']);

        $result = app(SupportScopeService::class)->classify('How do I deploy my site?');

        $this->assertSame(SupportScopeService::UNAVAILABLE, $result);
        Http::assertNothingSent();
    }

    public function test_classifier_server_failure_fails_closed(): void
    {
        Http::fake(['api.openai.com/*' => Http::response([], 500)]);

        $result = app(SupportScopeService::class)->classify('How do I deploy my site?');

        $this->assertSame(SupportScopeService::UNAVAILABLE, $result);
    }
}
