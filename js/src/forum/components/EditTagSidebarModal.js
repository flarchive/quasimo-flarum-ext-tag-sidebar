import app from 'flarum/common/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

export default class EditTagSidebarModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);
        const tag = this.attrs.tag;
        this.sidebar = Stream(tag.attribute('customSidebar') || '');
        this.saving = false;
    }

    className() {
        return 'EditTagSidebarModal Modal--large';
    }

    title() {
        return app.translator.trans('quasimo-tag-sidebar.forum.modal_title', {
            tag: this.attrs.tag.name(),
        });
    }

    content() {
        return m('div', { className: 'Modal-body' },
            m('div', { className: 'Form' },
                m('div', { className: 'Form-group' },
                    m('label', {},
                        app.translator.trans('quasimo-tag-sidebar.forum.sidebar_label')
                    ),
                    m('textarea', {
                        className: 'FormControl',
                        rows: 12,
                        value: this.sidebar(),
                        oninput: (e) => this.sidebar(e.target.value),
                        placeholder: app.translator.trans('quasimo-tag-sidebar.forum.sidebar_placeholder'),
                    })
                ),
                m('div', { className: 'Form-group' },
                    m(Button, {
                        className: 'Button Button--primary',
                        loading: this.saving,
                        onclick: this.save.bind(this),
                    }, app.translator.trans('quasimo-tag-sidebar.forum.save_button'))
                )
            )
        );
    }

    save() {
        if (this.saving) return;
        this.saving = true;

        const tag = this.attrs.tag;

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/tag-sidebar/' + tag.id(),
            body: {
                customSidebar: this.sidebar(),
            },
        }).then((response) => {
            this.saving = false;
            tag.pushAttributes({
                customSidebar: response.data.customSidebar,
            });
            app.modal.close();
            // Refresh the sidebar widget with updated content
            if (app.tagSidebarRender) app.tagSidebarRender(tag);
            m.redraw();
        }).catch(() => {
            this.saving = false;
            m.redraw();
        });
    }
}
