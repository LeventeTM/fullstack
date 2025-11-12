<?php

namespace App\Http\Controllers;

use App\Models\Basket;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class BasketController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        $basket = $user->baskets()->with('items')->first();

        if (!$basket) {
            return response()->json(['message' => 'A felhasználónak nincs aktív kosara.'], 404);
        }

        return response()->json($basket);
    }

    public function storeItem(Request $request)
    {
        $user = Auth::user();
        $basket = $user->baskets()->first();

        if (!$basket) {
            $basket = $user->baskets()->create([]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0.01',
            'quantity' => 'required|integer|min:1',
            'category' => 'required|string|max:255',
            'weight' => 'required|numeric|min:0',
        ]);

        $item = $basket->items()->create($validated);

        return response()->json($basket->load('items'), 201);
    }

    public function updateItem(Request $request, Item $item): JsonResponse
    {
        if ($item->basket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized access to item.'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validated['quantity'] <= 0) {
            $item->delete();
            return response()->json(['message' => 'Tétel törölve a kosárból.'], 200);
        }

        $item->update(['quantity' => $validated['quantity']]);

        return response()->json($item->basket->load('items'));
    }

    public function destroyItem(Item $item): JsonResponse
    {
        if ($item->basket->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized access to item.'], 403);
        }

        $item->delete();

        return response()->json(null, 204);
    }

    public function getTotal()
    {
        $user = Auth::user();
        $basket = $user->baskets()->with('items')->first();

        if (!$basket) {
            return response()->json(['total' => 0.0], 200);
        }

        $total = $basket->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        return response()->json(['total' => round((float)$total, 2)], 200);
    }

    public function destroyAllItems()
    {
        $user = Auth::user();
        $basket = $user->baskets()->first();

        if (!$basket) {
            return response()->json(['message' => 'Nincs mit törölni.'], 200);
        }

        $basket->items()->delete();

        return response()->json(['message' => 'A kosár sikeresen kiürítve.'], 200);
    }
}
