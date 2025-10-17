<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Book;
use App\Models\User;
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
            'user_email' => 'required|email|exists:users,email',
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Error validating loan', 400, $validator->errors());
        }

        try {
            $loan = DB::transaction(function () use ($request) {
                // Buscar usuario por email
                $user = User::where('email', $request->user_email)->first();

                if (!$user) {
                    throw new \Exception('User not found');
                }

                // Buscar libro con bloqueo para evitar préstamos simultáneos
                
                $book = Book::lockForUpdate()->find($request->book_id);

                if (!$book) {
                    throw new \Exception('Book not found');
                }


                if (!$book->available) {
                    throw new \Exception('Book not available');
                }

                // Crear el préstamo
                $loan = Loan::create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'loan_date' => now(),
                    'return_date' => $request->fecha_devolucion ?? null,
                ]);

                // Actualizar disponibilidad del libro
                $book->available = false;
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

        if ($loan->return_date) {
            return $this->errorResponse('This loan was already returned', 400);
        }

        try {
            DB::transaction(function () use ($loan) {
                $loan->return_date = now();
                $loan->save();

                $book = $loan->book;
                $book->available = true;
                $book->save();
            });

            return $this->successResponse($loan->load('book'), 'Loan returned successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('Error returning loan', 500);
        }
    }

public function destroy($id)
{
    $loan = Loan::with('book')->find($id);

    if (!$loan) {
        return $this->errorResponse('Loan not found', 404);
    }

    try {
        DB::transaction(function () use ($loan) {
            // Si el libro existe, lo marcamos como disponible
            if ($loan->book) {
                $loan->book->disponible = true;
                $loan->book->save();
            }

            // Luego eliminamos el préstamo
            $loan->delete();
        });

        return $this->successResponse(null, 'Loan deleted and book marked available', 200);
    } catch (\Exception $e) {
        return $this->errorResponse('Error deleting loan', 500);
    }
}

}
