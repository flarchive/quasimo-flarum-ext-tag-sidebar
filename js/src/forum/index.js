import app from 'flarum/app';
import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import { parseMarkdown } from './utils/markdown';

const WIDGET_ID = 'quasimo-tag-sidebar-widget';
const DIALOG_ID = 'quasimo-tag-sidebar-dialog';

function getTag() {
    const slug = m.route.param('tags');
    return slug ? app.store.getBy('tags', 'slug', slug) || null : null;
}

function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID);
    if (dialog) dialog.remove();
    document.body.classList.remove('TagSidebarDialog-open');
}

function showEditDialog(tag) {
    // Remove any existing dialog
    closeDialog();

    const overlay = document.createElement('div');
    overlay.id = DIALOG_ID;
    overlay.className = 'TagSidebarDialog-overlay';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });

    const dialog = document.createElement('div');
    dialog.className = 'TagSidebarDialog';

    // Header
    const header = document.createElement('div');
    header.className = 'TagSidebarDialog-header';

    const title = document.createElement('h3');
    title.className = 'TagSidebarDialog-title';
    title.textContent = app.translator.trans('quasimo-tag-sidebar.forum.modal_title', {
        tag: tag.attribute('name') || tag.id(),
    });

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'TagSidebarDialog-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeDialog);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = document.createElement('div');
    body.className = 'TagSidebarDialog-body';

    const label = document.createElement('label');
    label.className = 'TagSidebarDialog-label';
    label.textContent = app.translator.trans('quasimo-tag-sidebar.forum.sidebar_label');

    const textarea = document.createElement('textarea');
    textarea.className = 'TagSidebarDialog-textarea FormControl';
    textarea.rows = 12;
    textarea.value = tag.attribute('customSidebar') || '';
    textarea.placeholder = app.translator.trans('quasimo-tag-sidebar.forum.sidebar_placeholder');

    body.appendChild(label);
    body.appendChild(textarea);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'TagSidebarDialog-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'Button';
    cancelBtn.textContent = app.translator.trans('quasimo-tag-sidebar.forum.cancel_button');
    cancelBtn.addEventListener('click', closeDialog);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'Button Button--primary';
    saveBtn.textContent = app.translator.trans('quasimo-tag-sidebar.forum.save_button');
    saveBtn.addEventListener('click', () => {
        saveBtn.disabled = true;
        saveBtn.textContent = '...';

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/tag-sidebar/' + tag.id(),
            body: { customSidebar: textarea.value },
        }).then((response) => {
            tag.pushAttributes({ customSidebar: response.data.customSidebar });
            closeDialog();
            renderWidget(tag);
        }).catch(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = app.translator.trans('quasimo-tag-sidebar.forum.save_button');
        });
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.body.classList.add('TagSidebarDialog-open');

    // Focus textarea
    setTimeout(() => textarea.focus(), 50);

    // ESC to close
    overlay._onKeydown = (e) => { if (e.key === 'Escape') closeDialog(); };
    document.addEventListener('keydown', overlay._onKeydown);
    overlay.addEventListener('remove-listener', () => {
        document.removeEventListener('keydown', overlay._onKeydown);
    });
}

function renderWidget(tag) {
    const old = document.getElementById(WIDGET_ID);
    if (old) old.remove();

    if (!tag) return;

    const canEdit = !!(app.session.user && app.forum.attribute('canEditTagSidebar'));
    const customSidebar = tag.attribute('customSidebar');

    if (!customSidebar && !canEdit) return;

    const nav = document.querySelector('nav.IndexPage-nav')
             || document.querySelector('.sideNav');
    if (!nav) return;

    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.className = 'TagSidebarWidget';
    widget.dataset.slug = tag.attribute('slug') || '';

    if (customSidebar) {
        const content = document.createElement('div');
        content.className = 'TagSidebarWidget-content';
        content.innerHTML = parseMarkdown(customSidebar);
        widget.appendChild(content);
    } else if (canEdit) {
        const empty = document.createElement('p');
        empty.className = 'TagSidebarWidget-empty';
        empty.textContent = app.translator.trans('quasimo-tag-sidebar.forum.sidebar_empty');
        widget.appendChild(empty);
    }

    if (canEdit) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'Button Button--block TagSidebarWidget-editBtn';
        btn.textContent = app.translator.trans('quasimo-tag-sidebar.forum.edit_button');
        btn.addEventListener('click', () => showEditDialog(tag));
        widget.appendChild(btn);
    }

    nav.appendChild(widget);
}

app.initializers.add('quasimo-tag-sidebar', () => {
    extend(IndexPage.prototype, 'oncreate', function () {
        setTimeout(() => renderWidget(getTag()), 0);
    });

    extend(IndexPage.prototype, 'onupdate', function () {
        const tag = getTag();
        const existing = document.getElementById(WIDGET_ID);
        const existingSlug = existing ? existing.dataset.slug : null;
        const newSlug = tag ? tag.attribute('slug') || '' : null;

        if (existing && existingSlug === newSlug) return;

        renderWidget(tag);
    });

    extend(IndexPage.prototype, 'onremove', function () {
        closeDialog();
        const old = document.getElementById(WIDGET_ID);
        if (old) old.remove();
    });
});
