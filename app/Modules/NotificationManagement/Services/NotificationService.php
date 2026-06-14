<?php

namespace App\Modules\NotificationManagement\Services;

use App\Modules\Users\Models\User;
use App\Modules\NotificationManagement\Models\Notification;
use Illuminate\Support\Collection;

class NotificationService
{
    public function listForUser(User $user): Collection
    {
        return Notification::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (Notification $notification) => $this->payload($notification));
    }

    public function unreadCount(User $user): int
    {
        return Notification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }

    public function payload(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'link' => $notification->link,
            'data' => $notification->data,
            'read_at' => $notification->read_at?->toDateTimeString(),
            'created_at' => $notification->created_at?->toDateTimeString(),
        ];
    }

    public function create(User $user, array $data): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'link' => $data['link'] ?? null,
            'data' => $data['data'] ?? null,
        ]);
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->forceFill([
            'read_at' => now(),
        ])->save();

        return $notification->refresh();
    }

    public function markAllAsRead(User $user): void
    {
        Notification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

