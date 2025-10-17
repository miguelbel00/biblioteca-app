<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with(['user', 'book'])->get();

        $data = [
            'loans' => $loans,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            $data = [
                'message' => 'Error validating loan',
                'errors' => $validator->errors(),
                'status' => 400
            ];
            return response()->json($data, 400);
        }

        try {
            $loan = DB::transaction(function () use ($request) {
                $book = Book::lockForUpdate()->find($request->book_id);

                if (!$book) {
                    return null;
                }

                if (!$book->disponible) {
                    throw new \Exception('Book not available');
                }

                $loan = Loan::create([
                    'user_id' => $request->user_id,
                    'book_id' => $book->id,
                    'loan_date' => now(),
                ]);

                $book->disponible = false;
                $book->save();

                return $loan;
            });

            if (!$loan) {
                $data = [
                    'message' => 'Error creating loan',
                    'status' => 500
                ];
                return response()->json($data, 500);
            }

            $data = [
                'message' => 'Loan created successfully',
                'loan' => $loan,
                'status' => 201
            ];
            return response()->json($data, 201);
        } catch (\Exception $e) {
            $data = [
                'message' => $e->getMessage(),
                'status' => 400
            ];
            return response()->json($data, 400);
        }
    }

    public function show($id)
    {
        $loan = Loan::with(['user', 'book'])->find($id);

        if (!$loan) {
            $data = [
                'message' => 'Loan not found',
                'status' => 404
            ];
            return response()->json($data, 404);
        }

        $data = [
            'loan' => $loan,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function returnBook($id)
    {
        $loan = Loan::find($id);

        if (!$loan) {
            $data = [
                'message' => 'Loan not found',
                'status' => 404
            ];
            return response()->json($data, 404);
        }

        if ($loan->return_date) {
            $data = [
                'message' => 'This loan was already returned',
                'status' => 400
            ];
            return response()->json($data, 400);
        }

        try {
            DB::transaction(function () use ($loan) {
                $loan->return_date = now();
                $loan->save();

                $book = $loan->book;
                $book->disponible = true;
                $book->save();
            });

            $data = [
                'message' => 'Loan returned successfully',
                'loan' => $loan,
                'status' => 200
            ];
            return response()->json($data, 200);
        } catch (\Exception $e) {
            $data = [
                'message' => 'Error returning loan',
                'status' => 500
            ];
            return response()->json($data, 500);
        }
    }

    public function destroy($id)
    {
        $loan = Loan::find($id);

        if (!$loan) {
            $data = [
                'message' => 'Loan not found',
                'status' => 404
            ];
            return response()->json($data, 404);
        }

        $loan->delete();

        $data = [
            'message' => 'Loan deleted successfully',
            'status' => 200
        ];
        return response()->json($data, 200);
    }
}
