import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

export default class EditTagSidebarModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);
        const tag = this.attrs.tag;
        this.description = Stream(tag.attribute('customDescription') || '');
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
                // Description field
                m('div', { className: 'Form-group' },
                    m('label', {},
                        app.translator.trans('quasimo-tag-sidebar.forum.description_label')
                    ),
                    m('input', {
                        className: 'FormControl',
                        type: 'text',
                        value: this.description(),
                        oninput: (e) => this.description(e.target.value),
                        placeholder: app.translator.trans('quasimo-tag-sidebar.forum.description_placeholder'),
                    })
                ),
                // Sidebar markdown field
                m('div', { className: 'Form-group' },
                    m('label', {},
                        app.translator.trans('quasimo-tag-sidebar.forum.sidebar_label')
                    ),
                    m('textarea', {
                        className: 'FormControl',
                        rows: 10,
                        value: this.sidebar(),
                        oninput: (e) => this.sidebar(e.target.value),
                        placeholder: app.translator.trans('quasimo-tag-sidebar.forum.sidebar_placeholder'),
                    })
                ),
                // Save button
                m('div', { className: 'Form-group' },
                    m(Button, {
                        className: 'Button Button--primary',
                        type: 'submit',
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
                customDescription: this.description(),
                customSidebar: this.sidebar(),
            },
        }).then((response) => {
            this.saving = false;
            // Update tag attributes in store
            tag.pushAttributes({
                customDescription: response.data.customDescription,
                customSidebar: response.data.customSidebar,
            });
            this.hide();
            m.redraw();
        }).catch(() => {
            this.saving = false;
            m.redraw();
        });
    }
}
