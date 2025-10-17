<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Validator;

class BookController extends Controller
{
    public function index()
    {
        return Book::all();
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "title"=> "required|string",
            "author"=> "required|string",
            "genre"=> "required|string",
        ]);

        if($validator->fails())
        {
            $data=[
                'message'=>'Error validation book',
                'errors'=>$validator->errors(),
                'status'=>400
            ];
            return response()->json($data,400);
        }

        
        $book = Book::create([
            'title'=> $request->title,
            'author'=> $request->author,
            'genre'=> $request->genre,
        ]);


        if(!$book)
        {
            $data=[
                'message'=>'Error creating book',
                'status'=>500
            ];
            return response()->json($data,500);
        }

        return response()->json($book, 201);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if(!$book)
        {
            $data=[
                'message'=>'Book not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }
        $data=[
                'book'=>$book,
                'status'=>200
            ];
            return response()->json($data,200);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if(!$book)
        {
            $data=[
                'message'=>'Book not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }

        $validated = Validator::make($request ->all(),[
            'title' => 'string',
            'author' => 'string',
            'genre' => 'string',
            'available' => 'boolean',
        ]);

        if($validated->fails())
        {
            $data=[
                'message'=>'Error validation book',
                'errors'=>$validated->errors(),
                'status'=>400
            ];
            return response()->json($data,400);
        }

        if($request->has('title'))
        {
            $book->title = $request->title;
        }
        if($request->has('author'))
        {
            $book->author = $request->author;
        }
        if($request->has('genre'))
        {
            $book->genre = $request->genre;
        }
        if($request->has('available'))
        {
            $book->available = $request->available;
        }

        $book->save();
        $data=[
                'message'=>'Book updated',
                'book'=>$book,
                'status'=>200
            ];
        return response()->json($book);
    }

    public function destroy($id)

    {
        $book = Book::find($id);
        
        if(!$book)
        {
            $data=[
                'message'=>'Book not found',
                'status'=>404
            ];
            return response()->json($data,404);
        }

        $book->delete();
        $data=[
            'message'=> 'Book deleted',
            'status'=>200
        ];
            

        return response()->json($data,200);
    }
}
