<?php

namespace Quasimo\TagSidebar\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Tags\Tag;

class TagSidebarSerializer
{
    public function __invoke(AbstractSerializer $serializer, Tag $tag, array $attributes): array
    {
        $attributes['customSidebar'] = $tag->custom_sidebar;
        return $attributes;
    }
}
