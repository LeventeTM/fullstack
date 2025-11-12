<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BasketController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('api.login');

//Users routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']) -> name('api.user.users'); //gets all the users
    Route::get('/user/{user}', [UserController::class, 'show']) -> name('api.user.show'); //gets user by id
    Route::post('/store', [UserController::class, 'store']) -> name('api.user.store');
    Route::put('/update/{user}', [UserController::class, 'update']) -> name('api.user.update');
    Route::get('/orders/{user}', [UserController::class, 'orders']) -> name('api.user.orders'); //gets all order data from the specific user
});


Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::delete('/destroy/{user}', [UserController::class, 'destroy']) -> name('api.user.destroy');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('basket', [BasketController::class, 'show'])->name('api.basket.show');
    Route::delete('basket', [BasketController::class, 'destroyAllItems'])->name('api.basket.destroy_all');
    Route::get('basket/total', [BasketController::class, 'getTotal'])->name('api.basket.total');
    Route::post('basket/items', [BasketController::class, 'storeItem'])->name('api.basket.item.store');
    Route::patch('basket/items/{item}', [BasketController::class, 'updateItem'])->name('api.basket.item.update');
    Route::delete('basket/items/{item}', [BasketController::class, 'destroyItem'])->name('api.basket.item.destroy');
});
