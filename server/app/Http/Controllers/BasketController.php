<?php

namespace App\Http\Controllers;

use App\Models\Basket;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BasketController extends Controller
{
    // POST /additem
    // Hozzáad egy tételt a hitelesített felhasználó kosarához
    public function addItem(Request $request)
    {
        $user = Auth::user(); // Az aktuálisan bejelentkezett user

        // Keressük meg a felhasználó első (vagy aktív) kosarát
        $basket = $user->baskets()->first();

        if (!$basket) {
            // Helyettesíti a ValueError-t: A felhasználónak nincs kosara
            return response()->json(['message' => 'Nincs kosár hozzárendelve a felhasználóhoz.'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0.01',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = $basket->items()->create($validated);

        // Visszatér a kosár és a tételei (mint a Basket response_model)
        return response()->json($basket->load('items'), 200);
    }

    // GET /getusertotal
    // Kiszámolja a hitelesített felhasználó kosarának teljes árát
    public function getTotal()
    {
        $user = Auth::user();
        $basket = $user->baskets()->with('items')->first();

        if (!$basket) {
            return response()->json(['total' => 0.0], 200);
        }

        // Kiszámítja az összes tétel összesített árát
        $total = $basket->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        // A FastAPI float visszatérési típusát követjük
        return response()->json($total, 200);
    }

    // ... A többi függvény (updateItem, deleteItem, show, deleteAllItems) hasonlóan megvalósítható
}
