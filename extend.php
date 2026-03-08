<?php

use Quasimo\TagSidebar\Api\Controller\SaveTagSidebarController;
use Quasimo\TagSidebar\Api\Serializer\TagSidebarSerializer;
use Flarum\Extend;

return [
    // API route to save tag sidebar data
    (new Extend\Routes('api'))
        ->post('/tag-sidebar/{id}', 'quasimo-tag-sidebar.save', SaveTagSidebarController::class),

    // Extend Tag serializer to include custom fields
    (new Extend\ApiSerializer(\Flarum\Tags\Api\Serializer\TagSerializer::class))
        ->attributes(TagSidebarSerializer::class),

    // Forum frontend
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    // Database migrations
    (new Extend\Migration())
        ->directory(__DIR__ . '/migrations'),

    // Locale files
    new Extend\Locales(__DIR__ . '/resources/locale'),
];
