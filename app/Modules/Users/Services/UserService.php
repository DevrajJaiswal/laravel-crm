<?php

namespace App\Modules\Users\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return User::paginate($perPage);
    }

    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user;
    }

    public function deleteById(int $id): void
    {
        User::query()->whereKey($id)->delete();
    }
}
