<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return Inertia::render('admin/users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Pārbaude: administrators nevar izdzēst savu kontu
        if ($user->getKey() === Auth::id()) { // Проверка на попытку удалить свой собственный аккаунт
            return redirect()->back()->with('error', 'Вы не можете удалить свой собственный аккаунт.');
        }
        $user->delete();
        return redirect()->back()->with('success', 'Пользователь успешно удален.');
    }

    public function updateRole(User $user)
    {
        $user->role = $user->role === 'admin' ? 'user' : 'admin';
        $user->save();
        return redirect()->back();
    }

    public function toggleBlock(User $user)
    {

        if ($user->getKey() === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot ban your own account.');
        }

        $user->is_blocked = !$user->is_blocked;
        $user->save();

        return redirect()->back();
    }
}
