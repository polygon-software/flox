/* eslint-disable camelcase */
export default {
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
  },
  locales: {
    de: 'German',
    en: 'English',
  },
  authentication: {
    authentication: 'Authentication',
    welcome_back: 'Welcome back!',
    welcome_text: 'You can sign in to access your existing account',
    login: 'Log in',
    logout: 'Log out',
    signup: 'Sign up',
    username: 'Username',
    email: 'E-Mail',
    change_password: 'Change password',
    forgot_password: 'Forgot password',
    verification_code: 'Verification Code',
    password: 'Password',
    password_repeat: 'Repeat password',
    old_password: 'Old password',
    new_password: 'New password',
    new_password_repeat: 'Repeat new password',
    set_up_2fa: 'Set up Two Factor Authentication',
    set_up_2fa_description:
      'Use your preferred authenticator app to scan the QR code:',
    verification: 'Verification',
    verification_message: 'Enter your verification code:',
    resend_code: 'I did not receive a code',
  },
  errors: {
    error: 'Error',
    module_error: "Error: Module '{module}' is not active",
    invalid_password: 'Please enter a valid password',
    invalid_email: 'Please enter a valid e-mail address',
    invalid_username: 'Please enter a username',
    incorrect_password: 'Incorrect password',
    incorrect_email: 'Email address not found',
    incorrect_username: 'Username not found',
    non_matching_password: "Passwords don't match",
    invalid_user_pool: 'User Pool is invalid.',
    nothing_here: 'Oops. Nothing here...',
    user_not_defined: 'User Pool is not defined',
    missing_properties:
      "One or more of the following properties are missing for the given mutation: 'mutation', 'tables', 'type', 'cacheLocation'",
    not_logged_in: 'Trying to log out despite not being logged in!',
    error_occurred: 'An error occurred, try logging in again',
    cant_find_module: 'Cannot find module ',
    cache_location_missing: 'Cache Location is missing in mutationObject: ',
    missing_attributes: 'Missing attributes',
    unknown: 'Unknown Error',
    entry_edit_failed: 'Edit could not be saved',
    entry_delete_failed: 'Entry could not be deleted',
    account_disabled:
      'Your account is disabled. Please contact a system administrator.',
    incorrect_username_or_password: 'Incorrect username or password',
  },
  files: {
    files: 'Files',
    create_folder: 'Create Folder',
    folder_name: 'Folder Name',
    add: 'Add',
    failed_upload: '{value} file(s) could not be uploaded',
    file_upload: 'File Upload',
    no_preview: 'No preview available',
    remove: 'Remove',
    remove_all: 'Remove all files',
    selected_files: 'Selected Files',
    status: 'Status',
    status_ready: 'Ready',
    status_loading: 'Loading',
    status_done: 'Done',
    status_failed: 'Failed',
    successfully_uploaded: '{value} file(s) were successfully uploaded',
    successfully_deleted: '{value} file(s) were successfully deleted',
    upload: 'Upload',
    file_type: 'File Typ',
    filename: 'File Name',
    last_updated: 'Last Updated',
    size: 'Size',
    root: 'Home',
    access_rights_edited: 'Access rights edited',
    access_rights_edit_failed: 'Access rights could not be edited',
    preview_error_no_file: 'Unable to open file, no URL present',
    preview_error_no_audio:
      'Unable to play audio. File URL missing or not an audio file.',
    preview_error_no_video:
      'Unable to play video. File URL missing or not a video file.',
    preview_error_no_image:
      'Unable to open image. File URL missing or not an image file.',
    preview_error_no_pdf:
      'Unable to preview pdf. File URL missing or not a pdf file.',
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
  messages: {
    success: 'Success',
    failure: 'Failure',
    login_failed: 'Login failed',
    email_sent: 'E-Mail(s) sent',
    file_uploaded: 'Successfully uploaded file',
    files_uploaded: 'Successfully uploaded files',
    password_set: 'Password set successfully',
    enter_new_password: 'Please enter a new password',
    enter_verification_code:
      'Please enter the verification code you received via email',
    reset_password: 'Reset Password',
    enter_username: 'Please enter your username:',
    enter_email: 'Please enter your e-mail address:',
    verification: 'Verification',
    enter_2fa: 'Enter your two-factor authentication code',
    code_resent: 'Successfully re-sent code',
    password_changed:
      'Successfully changed password. Please log in using the new password.',
    account_created: 'Successfully created account',
    entry_edited: 'Edit saved',
    entry_deleted: 'Entry deleted',
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
  notification: {
    notifications: 'Notifications',
    no_notifications: 'No new notifications',
    invalid_title: 'Length of title invalid',
    invalid_content: 'Length of content invalid',
    send_notificaton: 'Send notification',
    notification_title: 'Notification Title',
    notification_content: 'Notification Content',
    notification_link: 'Notification Link (optional)',
    sent: 'Notification sent!',
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
