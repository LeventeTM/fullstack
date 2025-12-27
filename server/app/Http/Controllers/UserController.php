<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'is_admin', 'created_at')
                     ->paginate(20);

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'is_admin' => 'sometimes|boolean',
        ]);

         $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => false,
        ]);

        return response()->json([
            'message' => 'User successfully created.',
        ], 201);
    }

    public function show(User $user)
    {
        $user->load(['baskets', 'orders']);

        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'is_admin' => 'sometimes|boolean',
        ]);

        $user->update($request->except('password_confirmation'));

        return response()->json([
            'message' => 'User successfully updated.',
            'user' => $user->only('id', 'name', 'email', 'is_admin', 'updated_at')
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

    public function orders(User $user)
    {
        $orders = $user->orders()->with('items')->get();

        return response()->json($orders);
    }
}
