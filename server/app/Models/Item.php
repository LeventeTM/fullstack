<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'basket_id',
        'order_id',
        'name',
        'price',
        'quantity',
        'category',
        'description',
        'stock',
        'weight',
        'image',
        // 'item_id' helyett itt a Laravel alapértelmezett 'id'-t használjuk
    ];

    // Reláció a Kosárhoz
    public function basket()
    {
        return $this->belongsTo(Basket::class);
    }

    // Módosított: Létrehozhatunk egy "total" attribútumot
    protected $appends = ['total_price'];

    public function getTotalPriceAttribute()
    {
        return $this->price * $this->quantity;
    }

    /**
     * Reláció a rendeléshez (egy termék egy rendeléshez is tartozhat)
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Egy termék több rendeléshez is tartozhat (több-vagy-több kapcsolat).
     */
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_item')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

}
