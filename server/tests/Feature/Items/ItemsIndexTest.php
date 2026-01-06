<?php

namespace Tests\Feature\Items;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemsIndexTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensures that an authenticated user can retrieve
     * the full list of items via the public items index endpoint.
     */
    public function test_items_index_returns_items(): void
    {
        $user = User::factory()->create();

        Item::factory()->count(3)->create();

        $response = $this->actingAs($user)->getJson('/api/items');

        $response->assertOk()
            ->assertJsonStructure([
                '*' => ['id', 'name', 'category', 'price', 'stock'],
            ]);
    }

    /**
     * Ensures that the items index endpoint correctly filters
     * results by the provided category query parameter.
     */ 
    public function test_items_index_can_filter_by_category(): void
    {
        $user = User::factory()->create();

        Item::factory()->create(['category' => 'gyümölcs']);
        Item::factory()->create(['category' => 'zöldség']);

        $response = $this->actingAs($user)->getJson('/api/items?category=gyümölcs');

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertEquals('gyümölcs', $response->json()[0]['category']);
    }
}
