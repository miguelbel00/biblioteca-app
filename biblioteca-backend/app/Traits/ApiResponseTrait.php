<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponseTrait
{
    /**
     * Devuelve una respuesta JSON con formato uniforme.
     */
    protected function successResponse($data, string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
            'status' => $status
        ], $status);
    }

    /**
     * Devuelve una respuesta JSON de error con formato uniforme.
     */
    protected function errorResponse(string $message, int $status = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors,
            'status' => $status
        ], $status);
    }

    /**
     * Devuelve datos paginados con metainformación.
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, string $message = 'Data retrieved successfully'): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'next_page_url' => $paginator->nextPageUrl(),
                'prev_page_url' => $paginator->previousPageUrl(),
            ],
            'status' => 200
        ]);
    }
}
