<?php

use App\Modules\Auth\Providers\AuthServiceProvider;
use App\Modules\AccessControl\Providers\AccessControlServiceProvider;
use App\Modules\Core\Providers\CoreServiceProvider;
use App\Modules\ActivityManagement\Providers\ActivityManagementServiceProvider;
use App\Modules\DealManagement\Providers\DealManagementServiceProvider;
use App\Modules\ContactManagement\Providers\ContactManagementServiceProvider;
use App\Modules\CustomerManagement\Providers\CustomerManagementServiceProvider;
use App\Modules\LeadManagement\Providers\LeadManagementServiceProvider;
use App\Modules\NotificationManagement\Providers\NotificationManagementServiceProvider;
use App\Modules\SupportTicketManagement\Providers\SupportTicketManagementServiceProvider;
use App\Modules\DataTransfer\Providers\DataTransferServiceProvider;
use App\Modules\Setup\Providers\SetupServiceProvider;
use App\Modules\Users\Providers\UsersServiceProvider;
use App\Modules\ReportsAnalytics\Providers\ReportsAnalyticsServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    SetupServiceProvider::class,
    CoreServiceProvider::class,
    AuthServiceProvider::class,
    UsersServiceProvider::class,
    AccessControlServiceProvider::class,
    LeadManagementServiceProvider::class,
    ActivityManagementServiceProvider::class,
    DealManagementServiceProvider::class,
    NotificationManagementServiceProvider::class,
    SupportTicketManagementServiceProvider::class,
    DataTransferServiceProvider::class,
    ContactManagementServiceProvider::class,
    CustomerManagementServiceProvider::class,
    ReportsAnalyticsServiceProvider::class,
];
