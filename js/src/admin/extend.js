import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

export default [
  new Extend.Admin()
    .setting(() => ({
      setting: 'quasimo-tag-sidebar.sidebar_position',
      type: 'select',
      label: app.translator.trans('quasimo-tag-sidebar.admin.setting_position'),
      help: app.translator.trans('quasimo-tag-sidebar.admin.setting_position_help'),
      options: {
        left: app.translator.trans('quasimo-tag-sidebar.admin.position_left'),
        right: app.translator.trans('quasimo-tag-sidebar.admin.position_right'),
      },
      default: 'left',
    }))
    .setting(() => ({
      setting: 'quasimo-tag-sidebar.content_type',
      type: 'select',
      label: app.translator.trans('quasimo-tag-sidebar.admin.setting_content_type'),
      help: app.translator.trans('quasimo-tag-sidebar.admin.setting_content_type_help'),
      options: {
        markdown: app.translator.trans('quasimo-tag-sidebar.admin.content_type_markdown'),
        html: app.translator.trans('quasimo-tag-sidebar.admin.content_type_html'),
      },
      default: 'markdown',
    }))
    .permission(
      () => ({
        icon: 'fas fa-pen',
        label: app.translator.trans('quasimo-tag-sidebar.admin.permission_edit_sidebar'),
        permission: 'quasimo-tag-sidebar.editSidebar',
        allowGuest: false,
      }),
      'moderate'
    ),
];
