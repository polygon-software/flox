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
    warning: 'Warning',
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
    share: 'Share',
    files: 'Events from Station',
  },
  projects: {
    project: 'Project',
    device: 'Device | Devices',
    new_project: 'New Project',
    device_type: 'Device Type',
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
    assign_to_project: 'Assign to Project',
    remove_from_project: 'Remove from Project',
    compress_vibration_data: 'Compress Vibration Data',
    download_compress_vibration_data: 'Download compressed Vibration Data',
    display_data: 'Display Data',
    show_event: 'Show Event/Peak Files',
    edit_parameters: 'Edit Parameters',
    show_status_files: 'Show Status Files',
    show_device_health: 'Show Device Health',
    name: 'Name',
    project_name: 'Project Name',
    edit_project: 'Edit Project',
    id: 'ID',
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
    create_project: 'Create project',
    delete_project: 'Delete project',
    new_contact: 'New Contakt',
    load: 'Load',
    save: 'Save',
    show: 'Show',
    close: 'Close',
    confirm: 'Confirm',
    rename: 'Rename'
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
    incorrect_date_range: 'Please select a valid date range',
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
    vertical: 'Vertical',
    at: 'at',
  },
  period: {
    twelve_hours: '12 Hours',
    two_days: '2 Days',
    two_weeks: '2 Weeks',
    one_month: '1 Month',
    custom: 'Custom'
  },
  messages: {
    copied: 'Copied',
    project_created: 'Project created successfully',
    assigned_device: 'Device assigned successfully',
    removed_device: 'Device removed successfully',
    project_renamed: 'Project renamed successfully',
    project_deleted: 'Project deleted successfully'
  },
  status: {
    title: 'Status of',
    up: 'Up',
    down: 'Down'
  },
  client_connectivity: {
    title: 'Client Connectivity',
    date_time: 'Date/Time',
    real_ip: 'Real IP',
    port: 'Port',
    vpn_ip: 'VPN IP',
    event: 'Event',
  },
  log_files: {
    log_file: 'LOG File',
    ftp_log_file: 'FTP LOG File - recent uploads',
    rest_log_file: 'REST LOG File',
  },
  files: {
    events: '{events} events',
    peak_files: '{peak_files} peak-files',
    zip_files: '{zip_files} ZIP-Files',
    totally_files: '{files} of totally {total_files} files',
    file: 'File',
    type: 'Type',
    date_time: 'Date/Type',
    peak_x: 'Peak X',
    peak_y: 'Peak Y',
    peak_z: 'Peak Z',
    frq_x: 'Frq X',
    frq_y: 'Frq Y',
    frq_z: 'Frq Z',
    vsum: 'VSUM',
    download: 'Download',
  },
  dialog: {
    period: 'Period',
    scale: 'Scale',
    hours: '12 hours',
    days: '2 days',
    weeks: '2 weeks',
    months: '1 month',
    select_period: 'Select period',
    perception_level: 'Perception level',
    alarm_level: 'Alarm level',
    highest_peak: 'Highest peak',
    enter_value: 'Enter value',
  },
  device_health: {
    title: 'Health Status of',
    battery_voltage: 'Battery Voltage',
    cellular_signal: 'Cellular Signal',
    main_battery: 'Main Battery',
    good: 'good',
    fair: 'fair',
    poor: 'poor',
  },
  warnings: {
    unassign_device: 'Are you sure? All data for this device will be deleted!',
    delete_project: 'Are you sure? This will remove all devices from this project!'
  }
};
