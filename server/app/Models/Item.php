<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'basket_id',
        'name',
        'price',
        'quantity',
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
}
