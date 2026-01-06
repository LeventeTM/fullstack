<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterAndLoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensures that a user can:
     * 1) successfully register with valid credentials
     * 2) log in with those credentials
     * 3) receive a valid Sanctum access token
     * 4) receive the correct role flag (non-admin)
     */
    public function test_user_can_register_and_login_and_receive_token(): void
    {
        // Register
        $registerPayload = [
            'name' => 'Test User',
            'email' => 'test3@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $registerResponse = $this->postJson('/api/register', $registerPayload);
        $registerResponse->assertStatus(201);

        // Login
        $loginPayload = [
            'email' => 'test3@example.com',
            'password' => 'password',
        ];

        $loginResponse = $this->postJson('/api/login', $loginPayload);

        $loginResponse->assertOk()
            ->assertJsonStructure([
                'user' => ['id', 'is_admin'],
                'access_token',
                'token_type',
            ]);

        $this->assertEquals('Bearer', $loginResponse->json('token_type'));
        $this->assertNotEmpty($loginResponse->json('access_token'));
        $this->assertFalse((bool) $loginResponse->json('user.is_admin'));
    }

    /**
     * Ensures that login fails when incorrect credentials are provided
     * and that the API returns a validation-style error response (422),
     * not an authentication success or token.
     */
    public function test_login_fails_with_wrong_password(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test2@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertStatus(201);

        $this->postJson('/api/login', [
            'email' => 'test2@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422)
          ->assertJsonStructure(['message', 'errors']);
    }
}
