<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Loan;
use App\Models\User;
use App\Models\Book;
use Carbon\Carbon;

class LoansTableSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $books = Book::all();


        $activeCount = 0;
        $returnedCount = 0;

        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();


            $availableBooks = $books->where('available', true);


            if ($availableBooks->isEmpty()) {
                break;
            }

            $book = $availableBooks->random();


            if ($returnedCount < 6) {
                $returnDate = Carbon::now()->subDays(rand(0, 15));
                $returnedCount++;
            } else {
                $returnDate = null;
                $activeCount++;
            }

            Loan::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'loan_date' => Carbon::now()->subDays(rand(1, 30)),
                'return_date' => $returnDate,
            ]);

            $book->update(['available' => $returnDate ? true : false]);
        }
    }
}
