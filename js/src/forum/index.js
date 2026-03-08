import app from 'flarum/forum/app';
import { extend } from 'flarum/common/utils/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import TagHero from 'flarum/tags/forum/components/TagHero';
import Button from 'flarum/common/components/Button';
import EditTagSidebarModal from './components/EditTagSidebarModal';
import TagSidebarWidget from './components/TagSidebarWidget';

app.initializers.add('quasimo-tag-sidebar', () => {
    // Extend TagHero: inject edit button + custom description
    extend(TagHero.prototype, 'view', function (vnode) {
        const tag = this.attrs.tag;
        if (!tag) return;

        const isAdmin = app.session.user && app.session.user.isAdmin();
        const customDesc = tag.attribute('customDescription');

        if (!isAdmin && !customDesc) return;

        // Ensure children is an array we can push into
        if (!Array.isArray(vnode.children)) {
            vnode.children = vnode.children != null ? [vnode.children] : [];
        }

        if (customDesc) {
            vnode.children.push(
                m('div', { className: 'TagSidebar-customDescription' }, customDesc)
            );
        }

        if (isAdmin) {
            vnode.children.push(
                m('div', { className: 'TagSidebar-editBtnWrap' },
                    m(Button, {
                        className: 'Button Button--primary',
                        icon: 'fas fa-edit',
                        onclick: () => app.modal.show(EditTagSidebarModal, { tag }),
                    }, app.translator.trans('quasimo-tag-sidebar.forum.edit_button'))
                )
            );
        }
    });

    // Extend IndexPage sidebar: add custom widget
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
