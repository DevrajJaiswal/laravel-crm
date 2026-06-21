<?php

namespace App\Modules\Users\Controllers\Api;

use App\Modules\Users\Models\User;
use App\Modules\Users\Requests\StoreUserRequest;
use App\Modules\Users\Requests\UserRequest;
use App\Modules\Users\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->list($request->get('per_page', 15));
        return response()->json($users);
    }

    public function meta(): JsonResponse
    {
        return response()->json([
            'roles' => $this->userService->roles(),
        ]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($this->userService->payload($user));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json([
            'message' => 'User created',
            'user' => $this->userService->payload($user),
        ], 201);
    }

    public function update(UserRequest $request, User $user): JsonResponse
    {
        $user = $this->userService->update($user, $request->validated());
        return response()->json([
            'message' => 'User updated',
            'user' => $this->userService->payload($user),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->userService->deleteById($user->id);
        return response()->json(['message' => 'User deleted']);
    }
}

