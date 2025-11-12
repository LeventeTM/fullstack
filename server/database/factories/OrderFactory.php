<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Item;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['függőben', 'feldolgozás alatt', 'kiszállítva', 'teljesítve']),
            'total_price' => 0, // majd a termékek alapján számoljuk ki
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    /**
     * Opcionálisan rendeléshez generál néhány terméket is.
     */
    public function withItems(int $count = 3): static
    {
        return $this->afterCreating(function ($order) use ($count) {
            $items = Item::inRandomOrder()->take($count)->get();

            $total = 0;
            foreach ($items as $item) {
                $quantity = rand(1, 4);
                $price = $item->price;
                $order->items()->attach($item->id, [
                    'quantity' => $quantity,
                    'price' => $price,
                ]);
                $total += $price * $quantity;
            }

            $order->update(['total_price' => $total]);
        });
    }
}
