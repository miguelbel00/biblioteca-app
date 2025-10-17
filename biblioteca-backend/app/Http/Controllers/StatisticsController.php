<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\Loan;

class StatisticsController extends Controller
{
public function index()
{
    $totalBooks = Book::count();
    $availableBooks = Book::where('disponible', true)->count();
    $loanedBooks = max(0, $totalBooks - $availableBooks);

    $activeLoans = Loan::whereNull('fecha_devolucion')->count();
    $returnedLoans = Loan::whereNotNull('fecha_devolucion')->count();

    $topUsers = User::withCount(['loans' => function($q) {
        $q->whereNull('fecha_devolucion');
    }])
    ->orderByDesc('loans_count')
    ->take(5)
    ->get(['id','name','email']);

    $data = [
        'message' => 'Library statistics retrieved successfully',
        'total_books' => $totalBooks,
        'available_books' => $availableBooks,
        'loaned_books' => $loanedBooks,
        'active_loans' => $activeLoans,
        'returned_loans' => $returnedLoans,
        'top_users' => $topUsers,
        'status' => 200
    ];

    return response()->json($data, 200);
}

}
