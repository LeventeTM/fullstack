<?php

namespace Tests\Feature\Orders;

use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceOrderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensures that an authenticated user can:
     * 1) place an order with multiple items
     * 2) have the correct quantities stored in the pivot table
     * 3) have the total order price calculated correctly
     */
    public function test_authenticated_user_can_place_order_and_total_is_computed(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $itemA = Item::factory()->create(['price' => 1000, 'stock' => 50]); // price as whatever your API uses
        $itemB = Item::factory()->create(['price' => 2500, 'stock' => 50]);

        $payload = [
            'items' => [
                ['item_id' => $itemA->id, 'quantity' => 2],
                ['item_id' => $itemB->id, 'quantity' => 1],
            ],
        ];

        $response = $this->actingAs($user)->postJson('/api/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id', 'user_id', 'status', 'total_price', 'items'
            ]);

        $orderId = $response->json('id');

        /** @var Order $order */
        $order = Order::with('items')->findOrFail($orderId);

        // Expected total: 2*1000 + 1*2500 = 4500
        $this->assertEquals(4500, (int) $order->total_price);

        // Pivot assertions
        $this->assertCount(2, $order->items);

        $pivotA = $order->items->firstWhere('id', $itemA->id)->pivot;
        $this->assertEquals(2, (int) $pivotA->quantity);
        $this->assertEquals(1000, (int) $pivotA->price);

        $pivotB = $order->items->firstWhere('id', $itemB->id)->pivot;
        $this->assertEquals(1, (int) $pivotB->quantity);
        $this->assertEquals(2500, (int) $pivotB->price);
    }

    /**
     * Ensures that unauthenticated users are not allowed
     * to place orders and receive a 401 Unauthorized response.
     */
    public function test_guest_cannot_place_order(): void
    {
        $item = Item::factory()->create();

        $this->postJson('/api/orders', [
            'items' => [
                ['item_id' => $item->id, 'quantity' => 1],
            ],
        ])->assertStatus(401);
    }
}
