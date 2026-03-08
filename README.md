# Tag Sidebar Customizer

A [Flarum](https://flarum.org) extension that allows admins to customize the sidebar content and description for specific tag pages.

## Features

- Add a custom description to any tag page, replacing the default tag description
- Add custom sidebar content (supports Markdown: headings, bold, italic, links, lists) displayed below the "Start Discussion" button
- Admin-only edit button on each tag page opens a modal for easy editing
- Multilingual support (follows Flarum's current locale)

## Installation

```bash
composer require quasimo/flarum-ext-tag-sidebar
php flarum migrate
php flarum cache:clear
```

## Usage

1. Navigate to any tag page while logged in as an admin
2. Click the **Edit Sidebar** button in the tag hero section
3. Fill in the custom description and/or sidebar content (Markdown supported)
4. Click **Save**

### Sidebar Markdown Example

```markdown
## Useful Links
- [Documentation](https://docs.example.com)
- [Getting Started](https://example.com/start)

## Rules
- Be respectful
- Stay on topic
```

## Compatibility

- Flarum `^1.8`
- Requires `flarum/tags`

## Links

- [Packagist](https://packagist.org/packages/quasimo/flarum-ext-tag-sidebar)
- [GitHub](https://github.com/Quasimo/flarum-ext-tag-sidebar)
- [Flarum Extension Library](https://extiverse.com/extension/quasimo/flarum-ext-tag-sidebar)
