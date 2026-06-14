<?php

namespace App\Modules\ImportExport\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\ImportExport\Services\ImportService;
use App\Modules\ImportExport\Models\Import;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ImportController
{
    public function __construct(private ImportService $service) {}

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required','file'],
            'model' => ['required','string'],
        ]);

        $import = $this->service->createImport($request->user(), $request->file('file'), $request->input('model'));

        return response()->json(['import_id' => $import->id], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $imports = Import::query()->where('user_id', $request->user()->id)->latest()->get();

        return response()->json(['data' => $imports]);
    }

    public function show(Request $request, Import $import): JsonResponse
    {
        abort_unless($import->user_id === $request->user()->id, 403);

        return response()->json(['data' => $import]);
    }
}
