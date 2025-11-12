<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Basket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    // Reláció a Felhasználóhoz
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Reláció a Tételekhez (egy kosár több tételt tartalmaz)
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
