<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    // Only allow access if user is 'admin'
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }
        $users = User::all();
        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    // Update user info
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
        ]);

        $target = User::findOrFail($id);
        $target->update($request->only(['name', 'email']));

        return redirect()->back()->with('success', 'User updated successfully!');
    }

    // Delete user
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }

        $target = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($target->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $target->delete();
        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    // Promote user to admin
    public function promote(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized');
        }

        $target = User::findOrFail($id);

        // Prevent promoting if already admin
        if ($target->is_admin) {
            return redirect()->back()->with('error', 'User is already an admin.');
        }

        $target->is_admin = true;
        $target->save();

        return redirect()->back()->with('success', 'User promoted to admin successfully!');
    }
}
