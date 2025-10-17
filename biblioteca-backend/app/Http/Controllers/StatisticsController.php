<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\Loan;
use App\Traits\ApiResponseTrait;

class StatisticsController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        $totalBooks = Book::count();
        $availableBooks = Book::where('disponible', true)->count();
        $loanedBooks = max(0, $totalBooks - $availableBooks);

        $activeLoans = Loan::whereNull('fecha_devolucion')->count();
        $returnedLoans = Loan::whereNotNull('fecha_devolucion')->count();

        // 🔹 top 5 usuarios con más préstamos activos
        $topUsers = User::withCount(['loans' => function($q) {
            $q->whereNull('fecha_devolucion');
        }])
        ->orderByDesc('loans_count')
        ->take(5)
        ->get(['id', 'name', 'email', 'loans_count']);

        $stats = [
            'total_books' => $totalBooks,
            'available_books' => $availableBooks,
            'loaned_books' => $loanedBooks,
            'active_loans' => $activeLoans,
            'returned_loans' => $returnedLoans,
            'top_users' => $topUsers,
        ];

        return $this->successResponse($stats, 'Library statistics retrieved successfully');
    }
}
