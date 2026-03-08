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

    // Expose edit permission to forum frontend
    (new Extend\ApiSerializer(\Flarum\Api\Serializer\ForumSerializer::class))
        ->attribute('canEditTagSidebar', function (\Flarum\Api\Serializer\ForumSerializer $serializer) {
            return $serializer->getActor()->hasPermission('quasimo-tag-sidebar.editSidebar');
        }),

    // Forum frontend
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    // Admin frontend
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    // Locale files
    new Extend\Locales(__DIR__ . '/resources/locale'),
];
