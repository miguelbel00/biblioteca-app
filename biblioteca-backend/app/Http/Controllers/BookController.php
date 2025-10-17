<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Validator;
use App\Traits\ApiResponseTrait;

class BookController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $books = Book::orderBy('id', 'desc')->paginate(request()->get('per_page', 10));
        return $this->paginatedResponse($books, 'Books retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string",
            "author" => "required|string",
            "genre" => "required|string",
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Error validating book', 400, $validator->errors());
        }

        $book = Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'genre' => $request->genre,
            'available' => true
        ]);

        if (!$book) {
            return $this->errorResponse('Error creating book', 500);
        }

        return $this->successResponse($book, 'Book created successfully', 201);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return $this->errorResponse('Book not found', 404);
        }

        return $this->successResponse($book, 'Book retrieved successfully', 200);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return $this->errorResponse('Book not found', 404);
        }

        $validated = Validator::make($request->all(), [
            'title' => 'string',
            'author' => 'string',
            'genre' => 'string',
            'available' => 'boolean',
        ]);

        if ($validated->fails()) {
            return $this->errorResponse('Error validating book', 400, $validated->errors());
        }

        $book->fill($request->only(['title', 'author', 'genre', 'available']));
        $book->save();

        return $this->successResponse($book, 'Book updated successfully', 200);
    }

    public function destroy($id)
    {
        $book = Book::find($id);

        if (!$book) {
            return $this->errorResponse('Book not found', 404);
        }

        $book->delete();
        return $this->successResponse(null, 'Book deleted successfully', 200);
    }
}
