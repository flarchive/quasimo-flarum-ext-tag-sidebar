<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('tags', function (Blueprint $table) {
            $table->text('custom_description')->nullable();
            $table->text('custom_sidebar')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('tags', function (Blueprint $table) {
            $table->dropColumn(['custom_description', 'custom_sidebar']);
        });
    },
];
