<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Validator;
class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "name"=> "required|string",
            "email"=> "required|email|unique:users,email",
        ]);

        if($validator->fails())
        {
            $data=[
                'message'=>'Error validation user',
                'errors'=>$validator->errors(),
                'status'=>400
            ];
            return response()->json($data,400);
        }

        
        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,

        ]);


        if(!$user)
        {
            $data=[
                'message'=>'Error creating user',
                'status'=>500
            ];
            return response()->json($data,500);
        }

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if(!$user)
        {
            $data=[
                'message'=>'User not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }
        $data=[
                'user'=>$user,
                'status'=>200
            ];
            return response()->json($data,200);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if(!$user)
        {
            $data=[
                'message'=>'User not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }

        $validated = Validator::make($request ->all(),[
            'name' => 'string',
            'email' => 'string|email|unique:users,email,'.$id,
        ]);

        if($validated->fails())
        {
            $data=[
                'message'=>'Error validation user',
                'errors'=>$validated->errors(),
                'status'=>400
            ];
            return response()->json($data,400);
        }

        if($request->has('name'))
        {
            $user->name = $request->name;
        }
        if($request->has('email'))
        {
            $user->email = $request->email;
        }
        if($request->has('password'))
        {
            $user->password = bcrypt($request->password);
        }

        $user->save();
        $data=[
                'message'=>'User updated',
                'user'=>$user,
                'status'=>200
            ];
        return response()->json($user);
    }

    public function destroy($id)

    {
        $user = User::find($id);
        
        if(!$user)
        {
            $data=[
                'message'=>'User not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }

        $user->delete();
        $data=[
            'message'=> 'User deleted',
            'status'=>200
        ];
            

        return response()->json($data,200);
    }
}
