<?php

namespace App\Modules\Setup\Services;

class SystemHealthService
{
    public function status(): array
    {
        return [
            'status' => 'ok',
            'application' => config('app.name'),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
