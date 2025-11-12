<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();

            // Kapcsolatok – mindkettő opcionális, hogy ne legyen migrációs sorrend-függő
            $table->unsignedBigInteger('basket_id')->nullable();
            $table->foreign('basket_id')->references('id')->on('baskets')->nullOnDelete();

            $table->unsignedBigInteger('order_id')->nullable();
            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();

            // Termék mezők – az ItemFactory és a model $fillable alapján
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->integer('stock')->default(0);
            $table->decimal('weight', 6, 2);
            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
