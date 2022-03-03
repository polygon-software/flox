export default {
  general: {
    yes: 'Yes',
    no: 'No',
    new: 'New',
    newest: 'Newest',
    oldest: 'Oldest',
    sort_by: 'Sort by:',
    all: 'All',
    edit: 'Edit',
    view: 'View',
    home: 'Home',
    settings: 'Settings',
    loading: 'Loading',
    filter: 'Filter',
  },
  authentication: {
    loggedIn: 'Logged in as {user}',
    login: 'Log in',
    logout: 'Log out',
    signup: 'Sign up',
    forgot_password: 'Forgot password?',
    reset_password: 'Reset password',
    please_enter_username: 'Please enter your username',
  },
  account_data: {
    authentication: 'Authentication',
    email: 'E-Mail',
    username: 'Username',
    password: 'Password',
    repeat_password: 'Repeat password',
    account: 'Account',
    personal: 'Personal',
    address: 'Address',
    street: 'Street',
    number: 'Number',
    zip_code: 'ZIP Code',
    city: 'City',
    birthdate: 'Date of birth',
    first_name: 'First Name',
    last_name: 'Last Name',
    full_name: 'Name',
    company_name: 'Company Name',
    language: 'Language',
    salutation: 'Salutation',
    phone_number: 'Phone Number',
    conditions: 'Terms and Conditions',
    accept_conditions: 'I agree to the terms and conditions.',
    accept_condition_truthful: 'All information has been filled in truthfully.',
    optional: 'optional',
  },
  dashboard: {
    customer: 'Customer | Customer',
    project: 'Project | Projects',
    station: 'Station | Stations',
    device_pool: 'Device Pool',
    account: 'Account',
    share: 'Share'
  },
  projects: {
    project: 'Project',
    device: 'Device',
    client: 'Client',
    ip: 'IP',
    firmware: 'Firmware',
    serial: 'Serial',
    sale_status: 'Sale-Status',
    station: 'Station',
    vpn_status: 'VPN Status',
    pid: 'PID',
    files: 'Files',
    ftp: 'FTP',
    remove_from_project: 'Remove from Project',
    compress_vibration_data: 'Compress Vibration Data',
    download_compress_vibration_data: 'Download compressed Vibration Data',
    display_data: 'Display Data',
    show_event: 'Show Event/Peak Files',
    edit_parameters: 'Edit Parameters',
    show_status_files: 'Show Status Files',
    show_device_health: 'Show Device Health',
    name: 'Name',
  },
  edit_parameters: {
    user_data: 'User Data and Thresholds',
    contacts: 'Alert Contacts',
    project_name: 'Project Name',
    station_name: 'Station Name',
    name: 'Name',
    number: 'Mobile Number',
    email: 'Email',
    add_new_contact: 'Add new contact',
    event: 'Event',
    alarm1: 'Alarm 1',
    alarm2: 'Alarm 2',
    sms_limit: 'SMS limit',
    battery: 'Power/Battery',
    memory: 'Memory',
    daily: 'Daily',
  },
  buttons: {
    finish: 'Finish',
    back: 'Back',
    next_step: 'Next',
    cancel: 'Cancel',
    submit: 'Submit',
    ok: 'OK',
    new_project: 'New Project',
    custom_graph: 'Custom Graph',
    load_parameters: 'Load Parameters',
    copy: 'Copy',
    send: 'Send',
    create_link: 'Create Link',
    new_contact: 'New Contakt',
    load: 'Load',
    save: 'Save',
  },
  errors: {
    nothing_here: 'Oops. Nothing here...',
    user_not_defined: 'User Pool is not defined',
    missing_properties:
      "One or more of the following properties are missing for the given mutation: 'mutation', 'tables', 'type', 'cacheLocation'",
    not_logged_in: 'Trying to log out despite not being logged in!',
    error_occurred: 'An error occurred, try logging in again',
    cant_find_module: 'Cannot find module ',
    cache_location_missing: 'Cache Location is missing in mutationObject: ',
    missing_attributes: 'Missing attributes',
    invalid_password: 'Please enter a valid password',
    invalid_email: 'Please enter a valid e-mail address',
    invalid_username: 'Please enter a username',
    incorrect_password: 'Incorrect password',
    incorrect_email: 'Email address not found',
    incorrect_username: 'Username not found',
    non_matching_password: 'Passwords not matching',
    invalid_name: 'Please enter your name',
    invalid_number: 'Please enter a number',
    invalid_input: 'Please enter something',
    invalid_company_name: "Please enter your company's name",
    invalid_address: 'Please enter a valid address',
    invalid_house_number: 'This number does not exist',
    invalid_city: 'Please enter a valid city',
    invalid_zip_code: 'Please enter a valid ZIP code',
    invalid_phone_number: 'Please enter a valid phone number',
    invalid_option: 'Please choose a valid option.',
    must_accept_conditions: 'You have to accept the terms and conditions.',
    must_accept_condition_truthful:
      'You must have filled in all information truthfully.',
    missing_file: 'Missing file',
    missing_user_type: 'Please select a user type',
  },
  set_password: {
    description: 'Since this is your first login, please set a password.',
  },
  greetings: {
    welcome_datavis: 'Welcome to DataVis',
  },
  settings: {
    settings: 'Settings',
    general: 'General',
    account: 'Account',
    personal_data: 'Personal Data',
  },
  visualisation: {
    period: 'Period',
    horizontal: 'Horizontal',
    vertical: 'Vertical'
  },
  period: {
    twelve_hours: '12 Hours',
    two_days: '2 Days',
    two_weeks: '2 Weeks',
    one_month: '1 Month',
    custom: 'Custom'
  },
  messages: {
    copied: 'Copied'
  }
};
