<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Kezeli a felhasználó bejelentkezését és generálja a Sanctum tokent.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        // 1. Validáció: Ellenőrizzük az emailt és a jelszót
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            // Opcionális: a token nevének megadása
            'device_name' => 'nullable|string',
        ]);

        // 2. Hitelesítés: Megpróbáljuk bejelentkeztetni a felhasználót
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Hiba esetén dobunk egy hitelesítési kivételt
            throw ValidationException::withMessages([
                'email' => ['A megadott hitelesítő adatok helytelenek.'],
            ]);
        }

        // 3. Token generálása: Lekérjük a hitelesített felhasználót és generálunk tokent
        $user = Auth::user();

        // A 'device_name' alapértéke, ha nincs megadva
        $deviceName = $request->input('device_name', 'default-device');

        // Létrehozzuk a tokent. A 'server:access' a token képessége (abilities).
        $token = $user->createToken($deviceName, ['server:access'])->plainTextToken;

        // 4. Válasz: Visszaadjuk a tokent
        return response()->json([
            'message' => 'Sikeres bejelentkezés.',
            'user' => $user->only('id', 'is_admin'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * POST /api/logout
     * Törli a bejelentkezett felhasználó aktuális tokenjét (kijelentkezés).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Töröljük az aktuális tokent, amivel a kérés érkezett
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sikeres kijelentkezés.'], 200);
    }
}
