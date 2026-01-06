<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensures that an admin user can access
     * admin-only endpoints protected by AdminMiddleware.
     */
    public function test_admin_can_access_admin_users_index(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->getJson('/api/users')
            ->assertOk();
    }

    /**
     * Ensures that a non-admin authenticated user
     * receives a 403 Forbidden response on admin routes.
     */
    public function test_non_admin_gets_403_on_admin_routes(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->getJson('/api/users')
            ->assertStatus(403)
            ->assertJsonFragment(['message' => 'Unauthorized']);
    }


    /**
     * Ensures that unauthenticated users cannot access
     * admin-only routes and receive a 401 Unauthorized response.
     */
    public function test_guest_cannot_access_admin_routes(): void
    {
        $this->getJson('/api/users')->assertStatus(401);
    }
}
