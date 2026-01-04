<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total_price',
    ];

    /**
     * Minden rendelés egy felhasználóhoz (vásárlóhoz) tartozik.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Minden rendelés több terméket (Item) is tartalmazhat.
     * A kapcsolat az order_item pivot táblán keresztül valósul meg.
     */
    public function items()
    {
        return $this->belongsToMany(Item::class, 'order_item')
                    ->withTrashed()
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    /**
     * Statikus segédfüggvény: lekéri az összes rendelést az adatbázisból,
     * a kapcsolódó felhasználókkal és termékekkel együtt.
     */
    public static function orders()
    {
        return self::with(['user', 'items'])->get();
    }
}
