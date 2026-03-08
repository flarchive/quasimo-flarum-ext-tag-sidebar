import app from 'flarum/app';
import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import TagSidebarWidget from './components/TagSidebarWidget';

app.initializers.add('quasimo-tag-sidebar', () => {
    extend(IndexPage.prototype, 'sidebarItems', function (items) {
        const tagSlug = m.route.param('tags');
        if (!tagSlug) return;

        const tag = app.store.getBy('tags', 'slug', tagSlug);
        if (!tag) return;

        const customSidebar = tag.attribute('customSidebar');
        const isAdmin = app.session.user && app.session.user.isAdmin();

        if (customSidebar || isAdmin) {
            // Priority -100: append after ALL existing sidebar items to avoid
            // Mithril position-based diffing issues (no keys on sibling nodes).
            items.add('quasimo-tag-sidebar-widget', m(TagSidebarWidget, { tag }), -100);
        }
    });
});
