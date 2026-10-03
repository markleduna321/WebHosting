<?php

namespace Tests\Unit;

use App\Models\SupportConversation;
use App\Models\User;
use App\Services\SupportAccessService;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\TestCase;

class SupportAccessServiceTest extends TestCase
{
    public function test_guest_can_access_only_with_the_conversation_cookie(): void
    {
        $token = str_repeat('g', 64);
        $conversation = new SupportConversation([
            'user_id' => null,
            'guest_token_hash' => hash('sha256', $token),
        ]);
        $request = Request::create('/api/support/conversations/example', 'GET');
        $request->cookies->set(SupportAccessService::GUEST_COOKIE, $token);

        app(SupportAccessService::class)->authorize($request, $conversation);

        $this->assertTrue(true);
    }

    public function test_guest_without_matching_cookie_cannot_access_conversation(): void
    {
        $conversation = new SupportConversation([
            'user_id' => null,
            'guest_token_hash' => hash('sha256', 'secret-token'),
        ]);
        $request = Request::create('/api/support/conversations/example', 'GET');
        $request->cookies->set(SupportAccessService::GUEST_COOKIE, 'wrong-token');

        try {
            app(SupportAccessService::class)->authorize($request, $conversation);
            $this->fail('Expected an ownership 404.');
        } catch (NotFoundHttpException $exception) {
            $this->assertSame(404, $exception->getStatusCode());
        }
    }

    public function test_signed_in_user_can_access_only_owned_conversation(): void
    {
        $user = new User;
        $user->id = 42;
        $request = Request::create('/api/support/conversations/example', 'GET');
        $request->setUserResolver(fn () => $user);
        $conversation = new SupportConversation(['user_id' => 42]);

        app(SupportAccessService::class)->authorize($request, $conversation);

        $conversation->user_id = 43;

        try {
            app(SupportAccessService::class)->authorize($request, $conversation);
            $this->fail('Expected an ownership 404.');
        } catch (NotFoundHttpException $exception) {
            $this->assertSame(404, $exception->getStatusCode());
        }
    }
}
