<?php

use App\Http\Controllers\StatisticsController;

Route::get('/statistics', [StatisticsController::class, 'index']);
