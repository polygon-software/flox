import authenticationTranslations from './authentication';
import buttonTranslations from './buttons';
import cardTranslations from './cards';
import errorTranslations from './errors';
import fieldTranslations from './fields';
import fileTranslations from './files';
import messageTranslations from './messages';

/* eslint-disable camelcase */
export default {
  ...authenticationTranslations,
  ...buttonTranslations,
  ...cardTranslations,
  ...errorTranslations,
  ...fieldTranslations,
  ...fileTranslations,
  ...messageTranslations,
  general: {
    finish: 'Finish',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    confirm: 'Confirm',
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
  },
  locales: {
    de: 'German',
    en: 'English',
  },
  users: {
    users: 'Users',
    avatar: 'Avatar',
    username: 'Username',
    email: 'E-Mail',
    role: 'Role',
  },
  object_recognition: {
    description:
      'Object recognition analyzes any given image and detect over 5000 different labels.',
    import_images: 'Import Images',
    search_files: 'Search Files',
    object_recognition: 'Object Recognition',
    image_already_imported: 'Image was already imported',
    image_imported: 'Import successful',
    not_image: 'Import failed - file is not an image',
  },
  payment: {
    payment: 'Payment',
    payments: 'Payments',
    payment_details: 'Payment details',
    payment_date: 'Date',
    currency: 'Currency',
    test_payment: 'Do Test payment',
    pay: 'Pay',
    pay_amount: 'Pay ({amount})',
    succeeded: 'Payment succeeded',
    failed: 'Payment failed',
    buyer: 'Buyer',
    product: 'Product',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    avatar: 'Avatar',
    pending: 'Pending',
    success: 'Successful',
    error: 'Failed',
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
  pages: {
    home: {
      title: 'Home',
      meta: {
        title: 'Flox',
        description: 'This is a flox sample page',
        keywords: 'flox,sample,polygon',
      },
    },
  },
  menu: {
    home: 'Home',
    users: 'Users',
    access_rights: 'Access Rights',
    alias: 'Alias',
    files: 'Files',
    object_recognition: 'Object Recognition',
    face_recognition: 'Face Recognition',
    text_extraction: 'Text Extraction',
    settings: 'Settings',
    admin_panel: 'Admin Panel',
    payment: 'Payment',
  },
  footer: {
    developers: 'Developers',
    privacy: 'Privacy',
    terms: 'Terms',
  },

  alias: {
    alias: 'Alias',
    active: 'Active Alias',
    set_alias: 'Set Alias',
    remove_alias: 'Remove Alias',
    users: 'Users',
    avatar: 'Avatar',
    logged_in_as: 'You are currently logged in as',
    alias_on_user:
      'You are currently browsing with an active alias for the user with ID',
    description:
      'This module can be used to see and use the application as if you were another user. This functionality is only available for admin accounts.',
  },
  admin_panel: {
    admin_panel: 'Admin Panel',
    system_notification: 'System Notifications',
    broadcast_message:
      "Notify your system's users about updates, downtime and new features. Warning: these messages will be immediately visible for all users in your system and should hence only be sent with care.",
  },
  access_control: {
    users: 'Users',
    remove_user: 'Remove User',
    add_users: 'Add Users',
    access_control: 'Access Control',
    invalid_group_name: 'Invalid group name',
    create_group: 'Create new Access Group',
    access_groups: 'Zugriffsgruppen',
    add_group: 'Add Group',
    delete_group: 'Remove Group',
    add_to_group: 'Add to Access Group',
    group_name: 'Group Name',
    group_name_label: 'New Group Name',
    select_users: 'Select Users',
    manage_groups: 'Manage Access Groups',
    search_groups: 'Search User Group',
    no_access_groups: 'No access groups yet',
    read: 'Read',
    write: 'Wrute',
    create_description:
      'Create a new access group by providing a group name and specifying users that belong to this group. You can always add/remove users later on.',
  },
};
