<?php

namespace Quasimo\TagSidebar\Api\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Tags\Tag;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class SaveTagSidebarController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertPermission('quasimo-tag-sidebar.editSidebar');

        $id = Arr::get($request->getQueryParams(), 'id');
        $body = $request->getParsedBody();
        if (empty($body)) {
            $body = json_decode((string) $request->getBody(), true) ?? [];
        }

        $tag = Tag::findOrFail($id);
        $tag->custom_sidebar = $body['customSidebar'] ?? null;
        $tag->save();

        return new JsonResponse([
            'data' => [
                'id' => $tag->id,
                'customSidebar' => $tag->custom_sidebar,
            ]
        ]);
    }
}
