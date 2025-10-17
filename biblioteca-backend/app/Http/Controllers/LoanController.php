<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Traits\ApiResponseTrait;

class LoanController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $loans = Loan::with(['user', 'book'])
            ->orderBy('id', 'desc')
            ->paginate(request()->get('per_page', 10));

        return $this->paginatedResponse($loans, 'Loans retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Error validating loan', 400, $validator->errors());
        }

        try {
            $loan = DB::transaction(function () use ($request) {
                $book = Book::lockForUpdate()->find($request->book_id);

                if (!$book) {
                    throw new \Exception('Book not found');
                }

                if (!$book->disponible) {
                    throw new \Exception('Book not available');
                }

                $loan = Loan::create([
                    'user_id' => $request->user_id,
                    'book_id' => $book->id,
                    'fecha_prestamo' => now(),
                ]);

                $book->disponible = false;
                $book->save();

                return $loan;
            });

            return $this->successResponse($loan->load(['user', 'book']), 'Loan created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function show($id)
    {
        $loan = Loan::with(['user', 'book'])->find($id);

        if (!$loan) {
            return $this->errorResponse('Loan not found', 404);
        }

        return $this->successResponse($loan, 'Loan retrieved successfully', 200);
    }

    public function returnBook($id)
    {
        $loan = Loan::with('book')->find($id);

        if (!$loan) {
            return $this->errorResponse('Loan not found', 404);
        }

        if ($loan->fecha_devolucion) {
            return $this->errorResponse('This loan was already returned', 400);
        }

        try {
            DB::transaction(function () use ($loan) {
                $loan->fecha_devolucion = now();
                $loan->save();

                $book = $loan->book;
                $book->disponible = true;
                $book->save();
            });

            return $this->successResponse($loan->load('book'), 'Loan returned successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('Error returning loan', 500);
        }
    }

    public function destroy($id)
    {
        $loan = Loan::find($id);

        if (!$loan) {
            return $this->errorResponse('Loan not found', 404);
        }

        $loan->delete();
        return $this->successResponse(null, 'Loan deleted successfully', 200);
    }
}
