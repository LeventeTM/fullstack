<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
  public function login(Request $r) {
    $creds = $r->validate(['email'=>['required','email'],'password'=>['required']]);
    if (!Auth::attempt($creds, true)) return response()->json(['message'=>'Invalid credentials'], 422);
    $r->session()->regenerate();
    return ['message'=>'Logged in'];
  }
  public function me(Request $r) { return $r->user(); }
  public function logout(Request $r) {
    Auth::guard('web')->logout();
    $r->session()->invalidate(); $r->session()->regenerateToken();
    return ['message'=>'Logged out'];
  }
}

