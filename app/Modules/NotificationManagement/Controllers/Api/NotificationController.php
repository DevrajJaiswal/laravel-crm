<?php

namespace App\Modules\NotificationManagement\Controllers\Api;

use App\Modules\NotificationManagement\Models\Notification;
use App\Modules\NotificationManagement\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController
{
    public function __construct(
        private NotificationService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => $this->service->listForUser($user),
            'unread_count' => $this->service->unreadCount($user),
        ]);
    }

    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification = $this->service->markAsRead($notification);

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $this->service->payload($notification),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $this->service->markAllAsRead($request->user());

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }
}
