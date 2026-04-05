import app from 'flarum/app';

app.initializers.add('quasimo-tag-sidebar', () => {
    app.extensionData
        .for('quasimo-tag-sidebar')
        .registerSetting(function () {
            return m('.helpText', { style: 'margin-bottom: 16px; line-height: 1.6;' }, [
                m('p', { style: 'margin: 0 0 8px; font-weight: 600;' },
                    app.translator.trans('quasimo-tag-sidebar.admin.instructions_title')
                ),
                m('ol', { style: 'margin: 0; padding-left: 20px;' }, [
                    m('li', app.translator.trans('quasimo-tag-sidebar.admin.instruction_1')),
                    m('li', app.translator.trans('quasimo-tag-sidebar.admin.instruction_2')),
                    m('li', app.translator.trans('quasimo-tag-sidebar.admin.instruction_3')),
                    m('li', app.translator.trans('quasimo-tag-sidebar.admin.instruction_4')),
                ]),
            ]);
        })
        .registerSetting({
            setting: 'quasimo-tag-sidebar.sidebar_position',
            label: app.translator.trans('quasimo-tag-sidebar.admin.setting_position'),
            help: app.translator.trans('quasimo-tag-sidebar.admin.setting_position_help'),
            type: 'select',
            options: {
                left: app.translator.trans('quasimo-tag-sidebar.admin.position_left'),
                right: app.translator.trans('quasimo-tag-sidebar.admin.position_right'),
            },
            default: 'left',
        })
        .registerSetting({
            setting: 'quasimo-tag-sidebar.content_type',
            label: app.translator.trans('quasimo-tag-sidebar.admin.setting_content_type'),
            help: app.translator.trans('quasimo-tag-sidebar.admin.setting_content_type_help'),
            type: 'select',
            options: {
                markdown: app.translator.trans('quasimo-tag-sidebar.admin.content_type_markdown'),
                html: app.translator.trans('quasimo-tag-sidebar.admin.content_type_html'),
            },
            default: 'markdown',
        })
        .registerPermission(
            {
                icon: 'fas fa-pen',
                label: app.translator.trans('quasimo-tag-sidebar.admin.permission_edit_sidebar'),
                permission: 'quasimo-tag-sidebar.editSidebar',
                allowGuest: false,
            },
            'moderate'
        );
});
