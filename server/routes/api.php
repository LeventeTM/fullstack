<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;

Route::post('login', [AuthController::class, 'login'])->name('api.login'); // public route -- used for user and admin login
Route::post('/register', [UserController::class, 'store']) -> name('api.user.store'); // public route -- used for user registration

// Users routes (protected routes)
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/update/{user}', [UserController::class, 'update']) -> name('api.user.update'); // update user data
    Route::get('/myorders', [UserController::class, 'orders']) -> name('api.user.orders'); // gets all order data from the specific user
    Route::post('orders', [OrderController::class, 'store']); // All users can create a new order
    Route::get('items', [ItemController::class, 'index']); // All users can see the items
});

// Admin protected routes
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::get('/users', [UserController::class, 'index']) -> name('api.user.users'); // gets all the users
    Route::get('/user/{user}', [UserController::class, 'show']) -> name('api.user.show'); // gets user by id
    Route::delete('/destroy/{user}', [UserController::class, 'destroy']) -> name('api.user.destroy');
    Route::apiResource('orders', OrderController::class)->except(['store']); // all the admin features in OrderController
    Route::apiResource('items', ItemController::class)->except(['index']);
});
