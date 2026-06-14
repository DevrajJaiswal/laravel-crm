<?php

namespace App\Modules\ImportExport\Services;

use App\Modules\ImportExport\Models\Import;
use App\Modules\ImportExport\Jobs\ProcessImportJob;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\LeadManagement\Models\Lead;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\SupportTicketManagement\Models\Ticket;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportService
{
    private ?int $initiatorUserId = null;
    public function createImport(User $user, UploadedFile $file, string $model): Import
    {
        $path = $file->store('imports');

        $import = Import::create([
            'user_id' => $user->id,
            'model' => $model,
            'filename' => $path,
            'status' => 'queued',
        ]);

        ProcessImportJob::dispatch($import->id);

        return $import;
    }

    public function processImport(Import $import): void
    {
        $this->initiatorUserId = $import->user_id;
        $path = Storage::disk('local')->path($import->filename);
        if (! Storage::disk('local')->exists($import->filename)) {
            $import->forceFill(['status' => 'failed', 'errors' => ['file_not_found']])->save();
            return;
        }

        try {
            $rows = $this->readRowsFromFile($path);
        } catch (\Throwable $e) {
            $import->forceFill(['status' => 'failed', 'errors' => [$e->getMessage()]])->save();
            return;
        }

        if (empty($rows)) {
            $import->forceFill(['status' => 'failed', 'errors' => ['empty_file']])->save();
            return;
        }

        $header = array_shift($rows);
        if (! is_array($header) || empty($header)) {
            $import->forceFill(['status' => 'failed', 'errors' => ['invalid_header']])->save();
            return;
        }

        $header = array_map(fn($column) => is_string($column) ? strtolower(trim($column)) : '', $header);
        $header = array_filter($header, fn($column) => $column !== '');

        $rowsTotal = 0;
        $errors = [];

        foreach ($rows as $data) {
            if (! is_array($data) || count($data) === 0) {
                continue;
            }

            $rowsTotal++;
            $row = [];
            foreach ($header as $index => $columnName) {
                $row[$columnName] = array_key_exists($index, $data) ? $data[$index] : null;
            }

            $row = array_map(fn($value) => is_string($value) ? trim($value) : $value, $row);

            try {
                $this->processRow($import->model, $row);
            } catch (\Throwable $e) {
                $errors[] = ['row' => $rowsTotal, 'error' => $e->getMessage()];
            }
        }

        $import->forceFill([
            'rows_total' => $rowsTotal,
            'rows_processed' => $rowsTotal - count($errors),
            'errors' => $errors ?: null,
            'status' => empty($errors) ? 'completed' : 'completed_with_errors',
            'completed_at' => now(),
        ])->save();
    }

    private function readRowsFromFile(string $path): array
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if ($extension === 'csv') {
            return $this->readCsvFile($path);
        }

        $spreadsheet = IOFactory::load($path);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = [];

        foreach ($worksheet->getRowIterator() as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);
            $cells = [];

            foreach ($cellIterator as $cell) {
                $cells[] = $cell->getValue();
            }

            $rows[] = $cells;
        }

        return $rows;
    }

    private function readCsvFile(string $path): array
    {
        $rows = [];
        $handle = fopen($path, 'r');
        if ($handle === false) {
            throw new \RuntimeException('cannot_open_file');
        }

        while (($data = fgetcsv($handle)) !== false) {
            $rows[] = $data;
        }

        fclose($handle);

        return $rows;
    }

    private function processRow(string $model, array $row): void
    {
        switch (strtolower($model)) {
            case 'customers':
                $this->importCustomer($row);
                break;
            case 'leads':
                $this->importLead($row);
                break;
            case 'contacts':
                $this->importContact($row);
                break;
            case 'deals':
                $this->importDeal($row);
                break;
            case 'tickets':
                $this->importTicket($row);
                break;
            default:
                throw new \RuntimeException('Unknown model: ' . $model);
        }
    }

    private function importCustomer(array $row): void
    {
        $data = [
            'name' => $row['name'] ?? ($row['contact_name'] ?? null),
            'company_name' => $row['company_name'] ?? null,
            'email' => $row['email'] ?? null,
            'phone' => $row['phone'] ?? null,
            'status' => $row['status'] ?? 'Active',
            'industry' => $row['industry'] ?? null,
            'billing_address' => $row['billing_address'] ?? null,
            'shipping_address' => $row['shipping_address'] ?? null,
            'notes' => $row['notes'] ?? null,
        ];

        if (isset($row['owner_email'])) {
            $owner = User::where('email', $row['owner_email'])->first();
            if ($owner) $data['owner_id'] = $owner->id;
        }

        if (! isset($data['owner_id'])) {
            $data['owner_id'] = $this->initiatorUserId ?? User::first()?->id;
        }

        if (! empty($row['id']) && $customer = Customer::find($row['id'])) {
            $customer->fill(array_filter($data, fn($v) => $v !== null));
            $customer->save();
            return;
        }

        if (! empty($row['email']) && $customer = Customer::where('email', $row['email'])->first()) {
            $customer->fill(array_filter($data, fn($v) => $v !== null));
            $customer->save();
            return;
        }

        Customer::create($data);
    }

    private function importLead(array $row): void
    {
        $data = [
            'title' => $row['title'] ?? null,
            'company_name' => $row['company_name'] ?? null,
            'contact_name' => $row['contact_name'] ?? ($row['name'] ?? null),
            'email' => $row['email'] ?? null,
            'phone' => $row['phone'] ?? null,
            'source' => $row['source'] ?? null,
            'status' => $row['status'] ?? 'New',
            'value' => $row['value'] ?? null,
            'notes' => $row['notes'] ?? null,
        ];

        if (isset($row['owner_email'])) {
            $owner = User::where('email', $row['owner_email'])->first();
            if ($owner) $data['owner_id'] = $owner->id;
        }

        if (! empty($row['id']) && $lead = Lead::find($row['id'])) {
            $lead->fill(array_filter($data, fn($v) => $v !== null));
            $lead->save();
            return;
        }

        if (! empty($row['email']) && $lead = Lead::where('email', $row['email'])->first()) {
            $lead->fill(array_filter($data, fn($v) => $v !== null));
            $lead->save();
            return;
        }

        Lead::create(array_filter($data, fn($v) => $v !== null));
    }

    private function importContact(array $row): void
    {
        $customerId = $row['customer_id'] ?? null;
        if (! $customerId && isset($row['customer_email'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            if ($customer) $customerId = $customer->id;
        }

        $nameParts = explode(' ', trim($row['name'] ?? ($row['first_name'] . ' ' . ($row['last_name'] ?? ''))));
        $first = array_shift($nameParts) ?: null;
        $last = trim(implode(' ', $nameParts)) ?: null;

        $data = [
            'customer_id' => $customerId,
            'first_name' => $row['first_name'] ?? $first,
            'last_name' => $row['last_name'] ?? $last,
            'email' => $row['email'] ?? null,
            'phone' => $row['phone'] ?? null,
            'job_title' => $row['job_title'] ?? null,
            'is_primary' => isset($row['is_primary']) ? (bool)$row['is_primary'] : false,
            'notes' => $row['notes'] ?? null,
        ];

        if (! empty($row['id']) && $contact = Contact::find($row['id'])) {
            $contact->fill(array_filter($data, fn($v) => $v !== null));
            $contact->save();
            return;
        }

        if (! empty($row['customer_email']) && ! empty($row['email'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            $contact = Contact::where('email', $row['email'])
                ->when($customer, fn($query) => $query->where('customer_id', $customer->id))
                ->first();
            if ($contact) {
                $contact->fill(array_filter($data, fn($v) => $v !== null));
                $contact->save();
                return;
            }
        }

        Contact::create(array_filter($data, fn($v) => $v !== null));
    }

    private function importDeal(array $row): void
    {
        $customerId = $row['customer_id'] ?? null;
        if (! $customerId && isset($row['customer_email'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            if ($customer) $customerId = $customer->id;
        }

        $ownerId = null;
        if (isset($row['owner_email'])) {
            $owner = User::where('email', $row['owner_email'])->first();
            if ($owner) $ownerId = $owner->id;
        }

        $data = [
            'customer_id' => $customerId,
            'owner_id' => $ownerId,
            'title' => $row['title'] ?? null,
            'amount' => $row['amount'] ?? null,
            'stage' => $row['stage'] ?? null,
            'probability' => $row['probability'] ?? null,
            'expected_close_date' => $row['expected_close_date'] ?? null,
            'notes' => $row['notes'] ?? null,
        ];

        if (! empty($row['id']) && $deal = Deal::find($row['id'])) {
            $deal->fill(array_filter($data, fn($v) => $v !== null));
            $deal->save();
            return;
        }

        if (! empty($row['customer_email']) && ! empty($row['title'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            $deal = Deal::where('title', $row['title'])
                ->when($customer, fn($query) => $query->where('customer_id', $customer->id))
                ->first();
            if ($deal) {
                $deal->fill(array_filter($data, fn($v) => $v !== null));
                $deal->save();
                return;
            }
        }

        Deal::create(array_filter($data, fn($v) => $v !== null));
    }

    private function importTicket(array $row): void
    {
        $customerId = $row['customer_id'] ?? null;
        if (! $customerId && isset($row['customer_email'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            if ($customer) $customerId = $customer->id;
        }

        $contactId = $row['contact_id'] ?? null;
        if (! $contactId && isset($row['contact_email'])) {
            $contact = Contact::where('email', $row['contact_email'])->first();
            if ($contact) $contactId = $contact->id;
        }

        $assignedTo = null;
        if (isset($row['assigned_to_email'])) {
            $user = User::where('email', $row['assigned_to_email'])->first();
            if ($user) $assignedTo = $user->id;
        }

        $data = [
            'customer_id' => $customerId,
            'contact_id' => $contactId,
            'assigned_to_user_id' => $assignedTo,
            'subject' => $row['subject'] ?? null,
            'description' => $row['description'] ?? null,
            'status' => $row['status'] ?? 'Open',
            'priority' => $row['priority'] ?? 'Medium',
            'resolution_notes' => $row['resolution_notes'] ?? null,
        ];

        if (! empty($row['id']) && $ticket = Ticket::find($row['id'])) {
            $ticket->fill(array_filter($data, fn($v) => $v !== null));
            $ticket->save();
            return;
        }

        if (! empty($row['customer_email']) && ! empty($row['subject'])) {
            $customer = Customer::where('email', $row['customer_email'])->first();
            $ticket = Ticket::where('subject', $row['subject'])
                ->when($customer, fn($query) => $query->where('customer_id', $customer->id))
                ->first();
            if ($ticket) {
                $ticket->fill(array_filter($data, fn($v) => $v !== null));
                $ticket->save();
                return;
            }
        }

        Ticket::create(array_filter($data, fn($v) => $v !== null));
    }
}
