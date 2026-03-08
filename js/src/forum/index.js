import app from 'flarum/app';
import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import TagSidebarWidget from './components/TagSidebarWidget';

app.initializers.add('quasimo-tag-sidebar', () => {
    let widgetContainer = null;
    let mountedSlug = null;

    function getTag() {
        const slug = m.route.param('tags');
        return slug ? (app.store.getBy('tags', 'slug', slug) || null) : null;
    }

    function mountWidget(dom) {
        const slug = m.route.param('tags');

        // Nothing to do if already mounted for this slug
        if (slug && slug === mountedSlug && widgetContainer) return;

        // Clean up previous mount
        if (widgetContainer) {
            m.mount(widgetContainer, null);
            if (widgetContainer.parentNode) {
                widgetContainer.parentNode.removeChild(widgetContainer);
            }
            widgetContainer = null;
            mountedSlug = null;
        }

        if (!slug) return;

        const tag = app.store.getBy('tags', 'slug', slug);
        if (!tag) return;

        const isAdmin = app.session.user && app.session.user.isAdmin();
        if (!tag.attribute('customSidebar') && !isAdmin) return;

        // Find sidebar element – try common Flarum 1.x class names
        const sidebar = dom.querySelector('.IndexPage-toolbar--side')
                     || dom.querySelector('.IndexPage-toolbar');
        if (!sidebar) return;

        widgetContainer = document.createElement('div');
        widgetContainer.className = 'TagSidebarWidget-mount';
        sidebar.appendChild(widgetContainer);
        mountedSlug = slug;

        m.mount(widgetContainer, {
            view: () => {
                const currentTag = getTag();
                if (!currentTag) return m('span');
                return m(TagSidebarWidget, { tag: currentTag });
            },
        });
    }

    function cleanup() {
        if (widgetContainer) {
            m.mount(widgetContainer, null);
            if (widgetContainer.parentNode) {
                widgetContainer.parentNode.removeChild(widgetContainer);
            }
            widgetContainer = null;
            mountedSlug = null;
        }
    }

    extend(IndexPage.prototype, 'oncreate', function (result, vnode) {
        mountWidget(this.element || vnode.dom);
    });

    extend(IndexPage.prototype, 'onupdate', function (result, vnode) {
        mountWidget(this.element || vnode.dom);
    });

    extend(IndexPage.prototype, 'onremove', function () {
        cleanup();
    });
});
