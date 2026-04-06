<?php

use Quasimo\TagSidebar\Api\Controller\SaveTagSidebarController;
use Flarum\Extend;
use Flarum\Tags\Api\Resource\TagResource;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;

return [
    (new Extend\Settings())
        ->serializeToForum('tagSidebarPosition', 'quasimo-tag-sidebar.sidebar_position', function ($value) {
            return $value ?: 'left';
        })
        ->serializeToForum('tagSidebarContentType', 'quasimo-tag-sidebar.content_type', function ($value) {
            return $value ?: 'markdown';
        }),

    (new Extend\Routes('api'))
        ->post('/tag-sidebar/{id}', 'quasimo-tag-sidebar.save', SaveTagSidebarController::class),

    (new Extend\ApiResource(TagResource::class))
        ->fields(fn () => [
            Schema\Str::make('customSidebar')
                ->get(fn (\Flarum\Tags\Tag $tag) => $tag->custom_sidebar),
        ]),

    (new Extend\ApiResource(ForumResource::class))
        ->fields(fn () => [
            Schema\Boolean::make('canEditTagSidebar')
                ->get(fn ($model, \Flarum\Api\Context $context) => $context->getActor()->hasPermission('quasimo-tag-sidebar.editSidebar')),
        ]),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),
];
