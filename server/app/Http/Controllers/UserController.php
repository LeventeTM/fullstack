<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Összes felhasználó listázása.
     */
    public function index()
    {
        return User::select('id','name','email','is_admin','created_at')->get();
    }

    /**
     * Új felhasználó létrehozása.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:6'],
            'is_admin' => ['sometimes','boolean'],
        ]);

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response()->json($user, 201);
    }

    /**
     * Egy felhasználó lekérése.
     */
    public function show(User $user)
    {
        // rendelésekkel együtt is kérhető: $user->load('orders');
        return $user->only(['id','name','email','is_admin','created_at','updated_at']);
    }

    /**
     * Felhasználó frissítése.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => ['sometimes','string','max:255'],
            'email'    => ['sometimes','email','max:255','unique:users,email,'.$user->id],
            'password' => ['sometimes','string','min:6'],
            'is_admin' => ['sometimes','boolean'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);
        return response()->json($user);
    }

    /**
     * Felhasználó törlése.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Egy felhasználó összes rendelése (kiegészítő endpoint).
     */
    public function orders(User $user)
    {
        return $user->orders()->with('items')->get();
    }
}
