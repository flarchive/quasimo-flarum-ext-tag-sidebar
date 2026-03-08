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
