import accessControlTranslations from './accessControl';
import adminPanelTranslations from './adminPanel';
import aliasTranslations from './alias';
import authenticationTranslations from './authentication';
import buttonTranslations from './buttons';
import cardTranslations from './cards';
import errorTranslations from './errors';
import fieldTranslations from './fields';
import fileTranslations from './files';
import layoutTranslations from './layout';
import messageTranslations from './messages';
import notificationsTranslations from './notifications';
import objectRecognitionTranslations from './objectRecognition';
import pageTranslations from './pages';
import paymentTranslations from './payment';

/* eslint-disable camelcase */
export default {
  ...accessControlTranslations,
  ...adminPanelTranslations,
  ...aliasTranslations,
  ...authenticationTranslations,
  ...buttonTranslations,
  ...cardTranslations,
  ...errorTranslations,
  ...fieldTranslations,
  ...fileTranslations,
  ...layoutTranslations,
  ...messageTranslations,
  ...notificationsTranslations,
  ...objectRecognitionTranslations,
  ...pageTranslations,
  ...paymentTranslations,
  general: {
    finish: 'Finish',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    confirm: 'Confirm',
    enable: 'Enable',
    disable: 'Disable',
    export: 'Export',
    ok: 'OK',
    loading: 'Loading',
    failed: 'Failed',
    successful: 'Successful',
    save: 'Save',
    create: 'Create',
    apply: 'Apply',
    remove: 'Remove',
    results: 'Results',
    no_results: 'No Results',
    search: 'Search',
    display: 'Display',
    sample: 'Sample',
    yes: 'Yes',
    no: 'No',
  },
  locales: {
    de: 'German',
    en: 'English',
  },
  users: {
    all_users: 'All users',
    users: 'Users',
    avatar: 'Avatar',
    username: 'Username',
    email: 'E-Mail',
    role: 'Role',
    enabled: 'Enabled',
  },
  date: {
    date_format: 'MM.DD.YYYY',
  },
  validation: {
    email: 'E-Mail invalid',
  },
  table: {
    ctrl_shift_hint:
      'Hint: Use SHIFT to select / deselect a range and CTRL to add to selection',
  },
};
