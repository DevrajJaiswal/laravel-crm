<?php

namespace App\Modules\ImportExport\Services;

use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\ImportExport\Models\Export;
use App\Modules\LeadManagement\Models\Lead;
use App\Modules\SupportTicketManagement\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    public function export(User $user, string $model, string $format): StreamedResponse
    {
        if (! in_array($format, ['csv', 'xlsx'], true)) {
            throw new \InvalidArgumentException('Unsupported export format');
        }

        $records = $this->recordsForModel($model);
        $export = Export::create([
            'user_id' => $user->id,
            'model' => $model,
            'format' => $format,
            'filename' => null,
            'status' => 'completed',
            'rows_total' => $records->count(),
            'rows_exported' => $records->count(),
            'errors' => null,
            'started_at' => now(),
            'completed_at' => now(),
        ]);

        $filename = sprintf('crm-%s-export-%s.%s', $model, now()->format('Ymd-His'), $format);

        return response()->streamDownload(function () use ($format, $records, $model) {
            if ($format === 'csv') {
                $output = fopen('php://output', 'w');
                if ($output === false) {
                    throw new \RuntimeException('Unable to open output stream');
                }

                fputcsv($output, $this->headerForModel($model));

                foreach ($records as $record) {
                    fputcsv($output, $this->rowForModel($model, $record));
                }

                fclose($output);
                return;
            }

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->fromArray($this->headerForModel($model), null, 'A1');

            $rowIndex = 2;
            foreach ($records as $record) {
                $sheet->fromArray($this->rowForModel($model, $record), null, "A{$rowIndex}");
                $rowIndex++;
            }

            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => $format === 'csv' ? 'text/csv; charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    private function recordsForModel(string $model): Collection
    {
        return match (strtolower($model)) {
            'customers' => Customer::with('owner')->get(),
            'leads' => Lead::with('owner')->get(),
            'contacts' => Contact::with('customer')->get(),
            'deals' => Deal::with(['customer', 'owner'])->get(),
            'tickets' => Ticket::with(['customer', 'contact', 'assignedTo'])->get(),
            default => throw new \InvalidArgumentException('Unknown model: ' . $model),
        };
    }

    private function headerForModel(string $model): array
    {
        return match (strtolower($model)) {
            'customers' => ['id', 'name', 'company_name', 'email', 'phone', 'status', 'industry', 'billing_address', 'shipping_address', 'notes', 'owner_email'],
            'leads' => ['id', 'title', 'company_name', 'contact_name', 'email', 'phone', 'source', 'status', 'value', 'notes', 'owner_email'],
            'contacts' => ['id', 'customer_email', 'first_name', 'last_name', 'email', 'phone', 'job_title', 'is_primary', 'notes'],
            'deals' => ['id', 'customer_email', 'owner_email', 'title', 'amount', 'stage', 'probability', 'expected_close_date', 'notes'],
            'tickets' => ['id', 'customer_email', 'contact_email', 'assigned_to_email', 'subject', 'description', 'status', 'priority', 'resolution_notes', 'closed_at'],
            default => throw new \InvalidArgumentException('Unknown model: ' . $model),
        };
    }

    private function rowForModel(string $model, object $record): array
    {
        return match (strtolower($model)) {
            'customers' => [
                $record->id,
                $record->name,
                $record->company_name,
                $record->email,
                $record->phone,
                $record->status,
                $record->industry,
                $record->billing_address,
                $record->shipping_address,
                $record->notes,
                $record->owner?->email ?? '',
            ],
            'leads' => [
                $record->id,
                $record->title,
                $record->company_name,
                $record->contact_name,
                $record->email,
                $record->phone,
                $record->source,
                $record->status,
                $record->value,
                $record->notes,
                $record->owner?->email ?? '',
            ],
            'contacts' => [
                $record->id,
                $record->customer?->email ?? '',
                $record->first_name,
                $record->last_name,
                $record->email,
                $record->phone,
                $record->job_title,
                $record->is_primary ? '1' : '0',
                $record->notes,
            ],
            'deals' => [
                $record->id,
                $record->customer?->email ?? '',
                $record->owner?->email ?? '',
                $record->title,
                $record->amount,
                $record->stage,
                $record->probability,
                $record->expected_close_date?->format('Y-m-d') ?? '',
                $record->notes,
            ],
            'tickets' => [
                $record->id,
                $record->customer?->email ?? '',
                $record->contact?->email ?? '',
                $record->assignedTo?->email ?? '',
                $record->subject,
                $record->description,
                $record->status,
                $record->priority,
                $record->resolution_notes,
                $record->closed_at?->format('Y-m-d H:i:s') ?? '',
            ],
            default => throw new \InvalidArgumentException('Unknown model: ' . $model),
        };
    }
}
