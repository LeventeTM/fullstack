<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Összes rendelés listázása felhasználóval és tételekkel együtt.
     */
    public function index()
    {
        return Order::with(['user','items'])->latest()->paginate(5);
    }

    /**
     * Create a new order and attach items via pivot table.
     * * This method uses a DB Transaction to ensure that the order is only
     * saved if all items are successfully attached. It automatically
     * retrieves the authenticated user's ID from the token for security.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'status'           => ['sometimes', 'string', 'max:255'],
            'items'            => ['required', 'array', 'min:1'],
            'items.*.item_id'  => ['required', 'integer', 'exists:items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($request, $data) {
            $order = Order::create([
                'user_id'     => $request->user()->id,
                'status'      => $data['status'] ?? 'függőben',
                'total_price' => 0,
            ]);

            $total = 0;

            foreach ($data['items'] as $row) {
                $item  = Item::findOrFail($row['item_id']);
                $qty   = $row['quantity'];
                $price = $item->price;

                $order->items()->attach($item->id, [
                    'quantity' => $qty,
                    'price'    => $price,
                ]);

                $total += $price * $qty;
            }

            $order->update(['total_price' => $total]);

            return response()->json($order->load(['user', 'items']), 201);
        });
    }

    /**
     * Egy rendelés lekérése.
     */
    public function show(Order $order)
    {
        return $order->load(['user','items']);
    }

    /**
     * Rendelés frissítése (tipikusan státusz).
     */
    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['sometimes','string','max:255'],
        ]);

        $order->update($data);
        return response()->json($order->load(['user','items']));
    }

    /**
     * Rendelés törlése (tételek a cascade miatt mennek a pivotból).
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}
