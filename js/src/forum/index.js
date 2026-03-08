import app from 'flarum/app';
import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import EditTagSidebarModal from './components/EditTagSidebarModal';
import { parseMarkdown } from './utils/markdown';

const WIDGET_ID = 'quasimo-tag-sidebar-widget';

function getTag() {
    const slug = m.route.param('tags');
    return slug ? app.store.getBy('tags', 'slug', slug) || null : null;
}

function renderWidget(tag) {
    const old = document.getElementById(WIDGET_ID);
    if (old) old.remove();

    if (!tag) return;

    const isAdmin = !!(app.session.user && app.session.user.isAdmin());
    const customSidebar = tag.attribute('customSidebar');

    if (!customSidebar && !isAdmin) return;

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
    } else if (isAdmin) {
        const empty = document.createElement('p');
        empty.className = 'TagSidebarWidget-empty';
        empty.textContent = app.translator.trans('quasimo-tag-sidebar.forum.sidebar_empty');
        widget.appendChild(empty);
    }

    if (isAdmin) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'Button Button--block TagSidebarWidget-editBtn';
        btn.textContent = app.translator.trans('quasimo-tag-sidebar.forum.edit_button');
        btn.addEventListener('click', () => app.modal.show(EditTagSidebarModal, { tag }));
        widget.appendChild(btn);
    }

    // Append after all Mithril-managed children so Mithril won't touch it
    nav.appendChild(widget);
}

// Exposed so EditTagSidebarModal can refresh the widget after save
app.tagSidebarRender = renderWidget;

app.initializers.add('quasimo-tag-sidebar', () => {
    extend(IndexPage.prototype, 'oncreate', function () {
        // Defer until after Mithril's render cycle completes
        setTimeout(() => renderWidget(getTag()), 0);
    });

    extend(IndexPage.prototype, 'onupdate', function () {
        const tag = getTag();
        const existing = document.getElementById(WIDGET_ID);
        const existingSlug = existing ? existing.dataset.slug : null;
        const newSlug = tag ? tag.attribute('slug') || '' : null;

        // Skip if same tag is already rendered
        if (existing && existingSlug === newSlug) return;

        renderWidget(tag);
    });

    extend(IndexPage.prototype, 'onremove', function () {
        const old = document.getElementById(WIDGET_ID);
        if (old) old.remove();
    });
});
