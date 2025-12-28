<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // display paginated list of users
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'is_admin', 'created_at')
                     ->paginate(20);

        return response()->json($users);
    }

    /**
     * Store a newly created user in storage (Registration).
     * Validates input data, ensures email uniqueness, and handles password confirmation.
     * Note: 'is_admin' is forced to 'false' to prevent users from elevating their own privileges during signup.
     */
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

    /**
     * Display the specified user's details.
     * Uses Eager Loading (load) to include the user's baskets and orders in a single JSON response.
     */
    public function show(User $user)
    {
        $user->load(['baskets', 'orders']);

        return response()->json($user);
    }

    /**
     * Update the specified user's information.
     * Uses Rule::unique()->ignore() so the validation doesn't fail when the user keeps their existing email.
     * Updates only the provided fields while excluding sensitive data like password_confirmation from the update array.
     */
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

    /**
     * Remove the specified user from the database.
     * Returns a 204 No Content status code upon successful deletion.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Retrieve all orders belonging to a specific user.
     * Includes the items within each order using eager loading to avoid N+1 query issues.
     */
    public function orders(Request $request)
    {
        $orders = $request->user()->orders()->with('items')->get();

        return response()->json($orders);
    }
}
