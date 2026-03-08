<?php

namespace Quasimo\TagSidebar\Api\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Tags\Tag;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class SaveTagSidebarController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $id = $request->getAttribute('id');
        $body = $request->getParsedBody();

        $tag = Tag::findOrFail($id);
        $tag->custom_description = $body['customDescription'] ?? null;
        $tag->custom_sidebar = $body['customSidebar'] ?? null;
        $tag->save();

        return new JsonResponse([
            'data' => [
                'id' => $tag->id,
                'customDescription' => $tag->custom_description,
                'customSidebar' => $tag->custom_sidebar,
            ]
        ]);
    }
}
