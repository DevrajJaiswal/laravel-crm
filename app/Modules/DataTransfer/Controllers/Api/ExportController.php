<?php

namespace App\Modules\DataTransfer\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\DataTransfer\Models\Export;
use App\Modules\DataTransfer\Services\ExportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __construct(private ExportService $service) {}

    public function export(Request $request): StreamedResponse
    {
        $request->validate([
            'model' => ['required', 'string'],
            'format' => ['required', 'string', 'in:csv,xlsx'],
        ]);

        return $this->service->export($request->user(), $request->input('model'), $request->input('format'));
    }

    public function index(Request $request): JsonResponse
    {
        $exports = Export::query()->where('user_id', $request->user()->id)->latest()->get();
        return response()->json(['data' => $exports]);
    }

    public function show(Request $request, Export $export): JsonResponse
    {
        abort_unless($export->user_id === $request->user()->id, 403);
        return response()->json(['data' => $export]);
    }
}


