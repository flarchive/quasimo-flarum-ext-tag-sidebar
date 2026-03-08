import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import EditTagSidebarModal from './EditTagSidebarModal';
import { parseMarkdown } from '../utils/markdown';

export default class TagSidebarWidget extends Component {
    view() {
        const tag = this.attrs.tag;
        const customSidebar = tag.attribute('customSidebar');
        const isAdmin = app.session.user && app.session.user.isAdmin();

        if (!customSidebar && !isAdmin) return null;

        return m('div', { className: 'TagSidebarWidget' },
            customSidebar
                ? m('div', {
                    className: 'TagSidebarWidget-content',
                    // Render markdown as HTML safely
                    oncreate: (vnode) => {
                        vnode.dom.innerHTML = parseMarkdown(customSidebar);
                    },
                    onupdate: (vnode) => {
                        vnode.dom.innerHTML = parseMarkdown(customSidebar);
                    },
                })
                : (isAdmin && m('div', { className: 'TagSidebarWidget-empty' },
                    app.translator.trans('quasimo-tag-sidebar.forum.sidebar_empty')
                  ))
        );
    }
}
