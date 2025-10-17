<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ApiResponseTrait;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $users = User::orderBy('id', 'desc')->paginate(request()->get('per_page', 10));
        return $this->paginatedResponse($users, 'Users retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Error validating user', 400, $validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if (!$user) {
            return $this->errorResponse('Error creating user', 500);
        }

        return $this->successResponse($user, 'User created successfully', 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        return $this->successResponse($user, 'User retrieved successfully', 200);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        $validated = Validator::make($request->all(), [
            'name' => 'string',
            'email' => 'string|email|unique:users,email,' . $id,
        ]);

        if ($validated->fails()) {
            return $this->errorResponse('Error validating user', 400, $validated->errors());
        }

        $user->fill($request->only(['name', 'email']));

        if ($request->has('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return $this->successResponse($user, 'User updated successfully', 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully', 200);
    }
}
