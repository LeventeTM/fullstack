<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Összes termék listázása, opcionális kategória szűréssel (?category=gyümölcs).
     */
    public function index(Request $request)
    {
        $q = Item::query();

        if ($request->filled('category')) {
            $q->where('category', $request->string('category'));
        }

        // egyszerű lapozás, ha kell: ?page=1
        return $q->orderBy('name')->paginate(24);
    }

    /**
     * Új termék létrehozása.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required','string','max:255'],
            'category'    => ['required','string','max:255'],
            'price'       => ['required','numeric','min:0'],
            'stock'       => ['required','integer','min:0'],
            'weight'      => ['required','numeric','min:0'],
            'description' => ['nullable','string'],
            'image'       => ['nullable','string','max:1024'],
            'quantity'    => ['sometimes','integer','min:1'], // ha kosárhoz/összeghez használod
            'basket_id'   => ['nullable','integer'],
            'order_id'    => ['nullable','integer'],
        ]);

        $item = Item::create($data);
        return response()->json($item, 201);
    }

    /**
     * Egy termék lekérése.
     */
    public function show(Item $item)
    {
        return $item;
    }

    /**
     * Termék frissítése.
     */
    public function update(Request $request, Item $item)
    {
        $data = $request->validate([
            'name'        => ['sometimes','string','max:255'],
            'category'    => ['sometimes','string','max:255'],
            'price'       => ['sometimes','numeric','min:0'],
            'stock'       => ['sometimes','integer','min:0'],
            'weight'      => ['sometimes','numeric','min:0'],
            'description' => ['nullable','string'],
            'image'       => ['nullable','string','max:1024'],
            'quantity'    => ['sometimes','integer','min:1'],
            'basket_id'   => ['nullable','integer'],
            'order_id'    => ['nullable','integer'],
        ]);

        $item->update($data);
        return response()->json($item);
    }

    /**
     * Termék törlése.
     */
    public function destroy(Item $item)
    {
        $item->delete();
        return response()->json(null, 204);
    }
}
