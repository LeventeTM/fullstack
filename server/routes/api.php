<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UserController::class);
Route::get('users/{user}/orders', [UserController::class, 'orders']); // kiegészítő
Route::apiResource('items', ItemController::class);
Route::apiResource('orders', OrderController::class);
