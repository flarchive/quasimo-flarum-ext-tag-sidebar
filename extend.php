<?php

use Quasimo\TagSidebar\Api\Controller\SaveTagSidebarController;
use Flarum\Extend;

$extenders = [
    (new Extend\Settings())
        ->serializeToForum('tagSidebarPosition', 'quasimo-tag-sidebar.sidebar_position', function ($value) {
            return $value ?: 'left';
        })
        ->serializeToForum('tagSidebarContentType', 'quasimo-tag-sidebar.content_type', function ($value) {
            return $value ?: 'markdown';
        }),

    (new Extend\Routes('api'))
        ->post('/tag-sidebar/{id}', 'quasimo-tag-sidebar.save', SaveTagSidebarController::class),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),
];

// Flarum 2.x: register admin settings and permissions via PHP extender
if (class_exists(\Flarum\Extend\Admin::class)) {
    $extenders[] = (new Extend\Admin())
        ->setting([
            'setting' => 'quasimo-tag-sidebar.sidebar_position',
            'type'    => 'select',
            'label'   => 'quasimo-tag-sidebar.admin.setting_position',
            'help'    => 'quasimo-tag-sidebar.admin.setting_position_help',
            'options' => [
                'left'  => 'quasimo-tag-sidebar.admin.position_left',
                'right' => 'quasimo-tag-sidebar.admin.position_right',
            ],
            'default' => 'left',
        ])
        ->setting([
            'setting' => 'quasimo-tag-sidebar.content_type',
            'type'    => 'select',
            'label'   => 'quasimo-tag-sidebar.admin.setting_content_type',
            'help'    => 'quasimo-tag-sidebar.admin.setting_content_type_help',
            'options' => [
                'markdown' => 'quasimo-tag-sidebar.admin.content_type_markdown',
                'html'     => 'quasimo-tag-sidebar.admin.content_type_html',
            ],
            'default' => 'markdown',
        ])
        ->permission([
            'permission'   => 'quasimo-tag-sidebar.editSidebar',
            'label'        => 'quasimo-tag-sidebar.admin.permission_edit_sidebar',
            'icon'         => 'fas fa-pen',
            'defaultGroup' => 'mod',
        ]);
}

// Flarum 2.x: ApiResource + Schema
if (class_exists(\Flarum\Extend\ApiResource::class)) {
    $extenders[] = (new Extend\ApiResource(\Flarum\Tags\Api\Resource\TagResource::class))
        ->fields(fn () => [
            \Flarum\Api\Schema\Str::make('customSidebar')
                ->get(fn (\Flarum\Tags\Tag $tag) => $tag->custom_sidebar),
        ]);

    $extenders[] = (new Extend\ApiResource(\Flarum\Api\Resource\ForumResource::class))
        ->fields(fn () => [
            \Flarum\Api\Schema\Boolean::make('canEditTagSidebar')
                ->get(fn ($model, \Flarum\Api\Context $context) => $context->getActor()->hasPermission('quasimo-tag-sidebar.editSidebar')),
        ]);
} else {
    // Flarum 1.x: ApiSerializer
    $extenders[] = (new Extend\ApiSerializer(\Flarum\Tags\Api\Serializer\TagSerializer::class))
        ->attribute('customSidebar', function ($serializer, \Flarum\Tags\Tag $tag) {
            return $tag->custom_sidebar;
        });

    $extenders[] = (new Extend\ApiSerializer(\Flarum\Api\Serializer\ForumSerializer::class))
        ->attribute('canEditTagSidebar', function ($serializer) {
            return $serializer->getActor()->hasPermission('quasimo-tag-sidebar.editSidebar');
        });
}

return $extenders;
