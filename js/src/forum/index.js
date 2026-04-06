import app from 'flarum/common/app';
import * as extendModule from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import { parseMarkdown } from './utils/markdown';

// Support both Flarum 1.x (named export) and 2.x (default export)
const extend = extendModule.extend || (extendModule.default && extendModule.default.extend);

const WIDGET_ATTR = 'data-tag-sidebar';
const DIALOG_ID = 'quasimo-tag-sidebar-dialog';

function getTag() {
    const slug = m.route.param('tags');
    return slug ? app.store.getBy('tags', 'slug', slug) || null : null;
}

function closeDialog() {
    const overlay = document.getElementById(DIALOG_ID);
    if (overlay) {
        if (overlay._onKeydown) {
            document.removeEventListener('keydown', overlay._onKeydown);
        }
        overlay.remove();
    }
    document.body.classList.remove('TagSidebarDialog-open');
}

function showEditDialog(tag) {
    closeDialog();

    const contentType = app.forum.attribute('tagSidebarContentType') || 'markdown';

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
    label.textContent = contentType === 'html'
        ? app.translator.trans('quasimo-tag-sidebar.forum.sidebar_label_html')
        : app.translator.trans('quasimo-tag-sidebar.forum.sidebar_label');

    const textarea = document.createElement('textarea');
    textarea.className = 'TagSidebarDialog-textarea FormControl';
    textarea.rows = 12;
    textarea.value = tag.attribute('customSidebar') || '';
    textarea.placeholder = contentType === 'html'
        ? app.translator.trans('quasimo-tag-sidebar.forum.sidebar_placeholder_html')
        : app.translator.trans('quasimo-tag-sidebar.forum.sidebar_placeholder');

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

    setTimeout(() => textarea.focus(), 50);

    overlay._onKeydown = (e) => { if (e.key === 'Escape') closeDialog(); };
    document.addEventListener('keydown', overlay._onKeydown);
}

function buildWidget(tag, canEdit, contentType, extraClass) {
    const customSidebar = tag.attribute('customSidebar');

    const widget = document.createElement('div');
    widget.className = 'TagSidebarWidget' + (extraClass ? ' ' + extraClass : '');
    widget.setAttribute(WIDGET_ATTR, tag.attribute('slug') || '');

    if (customSidebar) {
        const content = document.createElement('div');
        content.className = 'TagSidebarWidget-content';
        content.innerHTML = contentType === 'html' ? customSidebar : parseMarkdown(customSidebar);
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

    return widget;
}

function renderWidget(tag) {
    // Remove all existing widgets and clean up layout class
    document.querySelectorAll(`[${WIDGET_ATTR}]`).forEach((el) => {
        if (el.parentNode) {
            el.parentNode.classList.remove('TagSidebarLayout--right');
        }
        el.remove();
    });

    if (!tag) return;

    const canEdit = !!(app.session.user && app.forum.attribute('canEditTagSidebar'));
    const customSidebar = tag.attribute('customSidebar');
    const contentType = app.forum.attribute('tagSidebarContentType') || 'markdown';
    const position = app.forum.attribute('tagSidebarPosition') || 'left';

    if (!customSidebar && !canEdit) return;

    const results = document.querySelector('.Page-content');

    if (position === 'right') {
        if (results) {
            const widget = buildWidget(tag, canEdit, contentType, 'TagSidebarWidget--right');
            results.insertAdjacentElement('afterend', widget);
            results.parentNode.classList.add('TagSidebarLayout--right');
        }
    } else {
        const nav = document.querySelector('.Page-sidebar') || document.querySelector('nav.IndexPage-nav') || document.querySelector('.sideNav');

        if (nav) {
            const desktopWidget = buildWidget(tag, canEdit, contentType, 'TagSidebarWidget--desktop');
            nav.appendChild(desktopWidget);
        }

        if (results) {
            const mobileWidget = buildWidget(tag, canEdit, contentType, 'TagSidebarWidget--mobile');
            results.insertAdjacentElement('afterend', mobileWidget);
        }
    }
}

app.initializers.add('quasimo-tag-sidebar', () => {
    extend(IndexPage.prototype, 'oncreate', function () {
        setTimeout(() => renderWidget(getTag()), 0);
    });

    extend(IndexPage.prototype, 'onupdate', function () {
        const tag = getTag();
        const existing = document.querySelector(`[${WIDGET_ATTR}]`);
        const existingSlug = existing ? existing.getAttribute(WIDGET_ATTR) : null;
        const newSlug = tag ? tag.attribute('slug') || '' : null;

        if (existing && existingSlug === newSlug) return;

        renderWidget(tag);
    });

    extend(IndexPage.prototype, 'onremove', function () {
        closeDialog();
        document.querySelectorAll(`[${WIDGET_ATTR}]`).forEach((el) => el.remove());
    });
});
