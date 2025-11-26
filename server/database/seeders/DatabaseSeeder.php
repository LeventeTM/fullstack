<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('order_item')->truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Termékek létrehozása
        $itemCount = 100;
        $usedCombos = [];
        $itemsToInsert = [];
        $maxAttempts = $itemCount * 10; // biztonsági limit, hogy ne fussunk végtelen ciklusba, ha esetleg nem találnánk elérhető combot, mert már létezik
        $attempts = 0;
        $created = 0;
        
        while (count($itemsToInsert) < $itemCount && $attempts < $maxAttempts) {
            $attempts++;
            $item = Item::factory()->make();

            // A márka az első szó, utána jön a terméknév
            $parts = explode(' ', $item->name, 2);
            $brand = $parts[0] ?? null;
            $productName = $parts[1] ?? null;

            // Ha valamiért nem sikerül értelmesen szétvágni, inkább ugrunk
            if (!$brand || !$productName) {
                continue;
            }

            $key = $brand . '|' . $productName;

            // Ha ez a (márka + terméknév) combo már létezik, generáljunk újat
            if (isset($usedCombos[$key])) {
                continue;
            }

            // Elmentjük az egyedi változatot
            $usedCombos[$key] = true;
            $item->save();   // <-- NINCS toArray(), nincs bulk insert
            $created++;
        }

        $this->command->info("{$created} egyedi (márka + terméknév) termék létrehozva.");

        // FIX FELHASZNÁLÓK
        // 1. Admin felhasználó létrehozása a Factory alapértelmezett értékeinek felülírásával
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // 2. Normál felhasználó (az is_admin mező itt az alapértelmezett (false) értéket kapja a modellben)
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);
        $this->command->info("Admin és tesztfelhasználó létrehozva.");

        // 3. Több normál felhasználó
        $users = User::factory(8)->create();
        $this->command->info("8 további felhasználó létrehozva.");

        // 4. Rendelések létrehozása a felhasználókhoz
        $allUsers = User::all();

        foreach ($allUsers as $user) {
            // minden userhez 1–3 rendelés
            Order::factory()
                ->count(rand(1, 3))
                ->state(['user_id' => $user->id])
                ->withItems(rand(2, 5))
                ->create();
        }

        $this->command->info("Rendelések sikeresen létrehozva, termékekkel összekapcsolva.");

        // 5. Ellenőrzés, hogy valóban annyi adat került létrehozásra, mint amennyit fent definiáltunk
        $totalOrders = Order::count();
        $totalUsers = User::count();
        $totalItems = Item::count();

        $this->command->info("Összesen: {$totalUsers} felhasználó, {$totalOrders} rendelés, {$totalItems} termék.");
    }
}
