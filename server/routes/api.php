<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/health', fn() => ['status'=>'ok']);

Route::middleware('web')->group(function () {
  Route::post('/login', [AuthController::class,'login']);
  Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [AuthController::class,'me']);
  Route::get('/projects', fn() => ['items'=>[['id'=>1,'name'=>'Demo']]]); // sample
});

