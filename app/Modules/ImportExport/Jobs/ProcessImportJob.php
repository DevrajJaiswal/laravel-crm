<?php

namespace App\Modules\ImportExport\Jobs;

use App\Modules\ImportExport\Models\Import;
use App\Modules\ImportExport\Services\ImportService;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private int $importId) {}

    public function handle(): void
    {
        $import = Import::find($this->importId);
        if (! $import) return;

        $import->forceFill(['status' => 'processing', 'started_at' => now()])->save();

        $service = new ImportService();
        $service->processImport($import);
    }
}
