import app from 'flarum/app';
import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import TagSidebarWidget from './components/TagSidebarWidget';

app.initializers.add('quasimo-tag-sidebar', () => {
    extend(IndexPage.prototype, 'sidebarItems', function (items) {
        const tag = app.current.get('tag');
        if (!tag) return;

        const customSidebar = tag.attribute('customSidebar');
        const isAdmin = app.session.user && app.session.user.isAdmin();

        if (customSidebar || isAdmin) {
            items.add(
                'quasimo-tag-sidebar-widget',
                m(TagSidebarWidget, { tag }),
                90
            );
        }
    });
});
