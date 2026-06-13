<?php

namespace App\Modules\ContactManagement\Controllers\Api;

use App\Modules\ContactManagement\Models\Contact;
use App\Modules\ContactManagement\Requests\StoreContactRequest;
use App\Modules\ContactManagement\Requests\UpdateContactRequest;
use App\Modules\ContactManagement\Services\ContactService;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Http\JsonResponse;

class ContactController
{
    public function __construct(
        private ContactService $service
    ) {}

    public function index(Customer $customer): JsonResponse
    {
        return response()->json([
            'data' => $this->service->listForCustomer($customer),
        ]);
    }

    public function store(StoreContactRequest $request, Customer $customer): JsonResponse
    {
        $contact = $this->service->create($customer, $request->validated());

        return response()->json([
            'message' => 'Contact created',
            'contact' => $this->service->payload($contact),
        ], 201);
    }

    public function update(UpdateContactRequest $request, Contact $contact): JsonResponse
    {
        $contact = $this->service->update($contact, $request->validated());

        return response()->json([
            'message' => 'Contact updated',
            'contact' => $this->service->payload($contact),
        ]);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $this->service->delete($contact);

        return response()->json([
            'message' => 'Contact deleted',
        ]);
    }
}
