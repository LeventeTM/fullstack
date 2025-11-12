<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // KÖTELEZŐ: kapcsoljuk a felhasználóhoz
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Állapot + végösszeg (összhangban az Order model + Factory-val)
            $table->string('status')->default('függőben');
            $table->decimal('total_price', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
