import app from 'flarum/common/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import EditTagSidebarModal from './EditTagSidebarModal';
import { parseMarkdown } from '../utils/markdown';

export default class TagSidebarWidget extends Component {
    view() {
        const tag = this.attrs.tag;
        const customSidebar = tag.attribute('customSidebar');
        const isAdmin = app.session.user && app.session.user.isAdmin();

        return m('div', { className: 'TagSidebarWidget' },
            customSidebar
                ? m('div', { className: 'TagSidebarWidget-content' },
                    m.trust(parseMarkdown(customSidebar))
                  )
                : (isAdmin && m('div', { className: 'TagSidebarWidget-empty' },
                    app.translator.trans('quasimo-tag-sidebar.forum.sidebar_empty')
                  )),

            isAdmin && m(Button, {
                className: 'Button Button--block TagSidebarWidget-editBtn',
                icon: 'fas fa-edit',
                onclick: () => app.modal.show(EditTagSidebarModal, { tag }),
            }, app.translator.trans('quasimo-tag-sidebar.forum.edit_button'))
        );
    }
}
