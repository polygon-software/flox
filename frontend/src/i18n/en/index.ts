export default {
  general: {
    finish: 'Finish',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    confirm: 'Confirm',
    ok: 'OK',
    loading: 'Loading',
    save: 'Save',
  },
  authentication: {
    authentication: 'Authentication',
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
  },
  files: {
    add: 'Add',
    failed_upload: '{value} file(s) could not be uploaded',
    file_upload: 'File Upload',
    no_preview: 'No preview available',
    remove: 'Remove',
    remove_all: 'Remove all files',
    status: 'Status',
    status_ready: 'Ready',
    status_loading: 'Loading',
    status_done: 'Done',
    status_failed: 'Failed',
    successfully_uploaded: '{value} file(s) were successfully uploaded',
    successfully_deleted: '{value} file(s) were successfully deleted',
    upload: 'Upload',
  },
  messages: {
    success: 'Success',
    failure: 'Failure',
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
    date_format: 'MM.DD.YYYY'
  },
  validation: {
    email: 'E-Mail invalid'
  }
};
