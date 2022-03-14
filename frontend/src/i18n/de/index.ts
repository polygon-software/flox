export default {
  general: {
    yes: 'Ja',
    no: 'Nein',
    new: 'Neu',
    newest: 'Neuste',
    oldest: 'Älteste',
    sort_by: 'Sortieren nach:',
    all: 'Alle',
    edit: 'Bearbeiten',
    view: 'Ansehen',
    home: 'Home',
    settings: 'Einstellungen',
    loading: 'Lädt',
    filter: 'Filter',
    warning: 'Warnung'
  },
  authentication: {
    loggedIn: 'Angemeldet als {user}',
    login: 'Anmelden',
    logout: 'Abmelden',
    signup: 'Registrieren',
    forgot_password: 'Passwort vergessen?',
    reset_password: 'Passwort zurücksetzen',
    redirected: 'Sie werden in Kürze weitergeleitet...',
    please_enter_username: 'Bitte geben Sie ihren Benutzernamen ein',
  },
  account_data: {
    authentication: 'Authentifizierung',
    email: 'E-Mail',
    username: 'Benutzername',
    password: 'Passwort',
    repeat_password: 'Passwort wiederholen',
    account: 'Account',
    personal: 'Persönliches',
    address: 'Addresse',
    street: 'Strasse',
    number: 'Nummer',
    zip_code: 'Postleitzahl',
    city: 'Ort',
    birthdate: 'Geburtsdatum',
    first_name: 'Vorname',
    last_name: 'Nachname',
    full_name: 'Name',
    company_name: 'Firmenname',
    language: 'Sprache',
    phone_number: 'Telefonnummer',
    conditions: 'AGB',
    accept_conditions: 'Ich stimme den AGB zu.',
    salutation: 'Anrede',
    accept_condition_truthful: 'Alle Angaben sind wahrheitsgetreu ausgefüllt.',
    optional: 'optional',
  },
  dashboard: {
    customer: 'Kunde | Kunden',
    project: 'Projekt | Projekte',
    station: 'Station | Stationen',
    device_pool: 'Gerätepool',
    account: 'Account',
    share: 'Teilen',
    files: 'Ereignisse von Station',
  },
  projects: {
    project: 'Projekt',
    device: 'Gerät | Geräte',
    new_project: 'Neues Projekt',
    device_type: 'Gerätetyp',
    client: 'Client',
    ip: 'IP',
    firmware: 'Firmware',
    serial: 'Serial',
    sale_status: 'Verkaufs-Status',
    station: 'Station',
    vpn_status: 'VPN Status',
    pid: 'PID',
    files: 'Dokumente',
    ftp: 'FTP',
    assign_to_project: 'Zu Projekt zuordnen',
    remove_from_project: 'Aus Projekt entfernen',
    compress_vibration_data: 'Vibrationsdaten komprimieren',
    download_compress_vibration_data: 'Komprimierte Vibrationsdaten herunterladen',
    display_data: 'Daten anzeigen',
    show_event: 'Ereignis-/Peak-Dateien anzeigen',
    edit_parameters: 'Parameter bearbeiten',
    show_status_files: 'Statusdateien anzeigen',
    show_device_health: 'Gerätezustand anzeigen',
    name: 'Name',
    project_name: 'Projektname',
    edit_project: 'Projekt bearbeiten',
    edit_project_name: 'Projektnamen bearbeiten',
    id: 'ID',
  },
  edit_parameters: {
    user_data: 'Benutzerdaten und Schwellenwerte',
    contacts: 'Alert-Kontakte',
    project_name: 'Projektname',
    station_name: 'Stationsname',
    name: 'Name',
    number: 'Telefonnumer',
    email: 'E-mail',
    add_new_contact: 'Füge neuen Kontakt hinzu',
    event: 'Ereigniss',
    alarm1: 'Alarm 1',
    alarm2: 'Alarm 2',
    sms_limit: 'SMS-Grenze',
    battery: 'Leistung/Batterie',
    memory: 'Erinnerung',
    daily: 'Täglich',
  },
  buttons: {
    finish: 'Abschliessen',
    back: 'Zurück',
    next_step: 'Weiter',
    submit: 'Senden',
    cancel: 'Abbrechen',
    ok: 'OK',
    new_project: 'Neues Projekt',
    custom_graph: 'Benutzerdefinierte Grafik',
    load_parameters: 'Parameter laden',
    copy: 'Kopieren',
    send: 'Senden',
    create_link: 'Link erzeugen',
    create_project: 'Projekt erstellen',
    delete_project: 'Projekt löschen',
    new_contact: 'Neuer Kontakt',
    load: 'Laden',
    save: 'Speichern',
    show: 'Anzeigen',
    close: 'Schliessen',
    confirm: 'Bestätigen',
    rename: 'Umbenennen',
    discard: 'Verwerfen'
  },
  errors: {
    nothing_here: 'Hoppla. Hier hat es nichts...',
    user_not_defined: 'Benutzerpool ist nicht definiert',
    missing_properties:
      "Eine oder mehrere der folgenden Eigenschaften fehlen für die angegebene Mutation: 'mutation', 'tables', 'type', 'cacheLocation'",
    not_logged_in:
      'Versucht, sich abzumelden, obwohl man nicht eingeloggt ist!',
    error_occurred:
      'Ein Fehler ist aufgetreten, versuchen Sie sich erneut anzumelden',
    cant_find_module: 'Kann Modul nicht finden ',
    cache_location_missing: 'Cache-Speicherort fehlt in mutationObject: ',
    missing_attributes: 'Fehlende Attribute',
    incorrect_email: 'E-Mail Adresse wurde nicht gefunden',
    incorrect_username: 'Benutzername wurde nicht gefunden',
    non_matching_password: 'Passwörter stimmen nicht überein',
    invalid_name: 'Bitte geben Sie Ihren Namen ein',
    invalid_number: 'Bitte geben Sie eine Zahl ein',
    invalid_input: 'Bitte geben Sie etwas ein',
    invalid_password: 'Bitte geben Sie ein gültiges Passwort ein',
    invalid_email: 'Bitte geben Sie eine gültige E-Mail Adresse ein',
    invalid_username: 'Bitte geben Sie einen Benutzernamen ein',
    incorrect_password: 'Inkorrektes Passwort',
    invalid_address: 'Bitte geben Sie eine gültige Addresse ein',
    invalid_city: 'Bitte geben Sie einen gültigen Ort ein',
    invalid_house_number: 'Diese Nummer existiert nicht',
    invalid_zip_code: 'Bitte geben Sie eine gültige Postleitzahl ein',
    invalid_phone_number: 'Bitte geben Sie eine gültige Telefonnummer ein',
    invalid_option: 'Bitte wählen Sie eine gültige Option.',
    invalid_company_name: 'Bitte geben Sie Ihren Firmennamen ein',
    must_accept_conditions: 'Sie müssen den AGBs zustimmen.',
    must_accept_condition_truthful:
      'Sie müssen alle Angaben wahrheitsgetreu aufgefüllt haben.',
    missing_file: 'Datei fehlt',
    missing_user_type: 'Bitte wählen Sie eine Benutzerklasse',
    incorrect_date_range: 'Bitte wählen Sie einen gültigen Zeitraum aus',
    error_while_editing: 'Beim Bearbeiten des Projekts ist ein Fehler aufgetreten.'
  },
  set_password: {
    description:
      'Da dies dein erster Login ist, bitten wir dich, ein Passwort zu setzen.',
  },
  greetings: {
    welcome_datavis: 'Willkommen bei DataVis',
  },
  settings: {
    settings: 'Einstellungen',
    general: 'Allgemein',
    account: 'Benutzerkonto',
    personal_data: 'Persönliche Daten',
  },
  visualisation: {
    period: 'Periode',
    horizontal: 'Horizontal',
    vertical: 'Vertikal',
    at: 'bei',
  },
  period: {
    twelve_hours: '12 Stunden',
    two_days: '2 Tage',
    two_weeks: '2 Wochen',
    one_month: '1 Monat',
    custom: 'Eigene'
  },
  messages: {
    copied: 'Kopiert',
    project_created: 'Projekt erfolgreich erstellt',
    assigned_device: 'Gerät erfolgreich zugeordnet',
    removed_device: 'Gerät erfolgreich entfernt',
    project_renamed: 'Projekt erfolgreich umbenannt',
    project_deleted: 'Projekt erfolgreich gelöscht'
  },
  status: {
    title: 'Status von',
    up: 'Up',
    down: 'Down'
  },
  client_connectivity: {
    title: 'Client-Konnektivität',
    date_time: 'Datum/Zeit',
    real_ip: 'Echter IP',
    port: 'Port',
    vpn_ip: 'VPN IP',
    event: 'Ereignisse',
  },
  log_files: {
    log_file: 'LOG Datei',
    ftp_log_file: 'FTP LOG Datei - aktuelle Uploads',
    rest_log_file: 'REST LOG Datei',
  },
  files: {
    events: '{events} Ereignisse',
    peak_files: '{peak_files} Peak-Dateien',
    zip_files: '{zip_files} ZIP-Dateien',
    totally_files: '{files} von insgesamt {total_files} Dateien',
    file: 'Datei',
    type: 'Typ',
    date_time: 'Datum/Typ',
    peak_x: 'Spitze X',
    peak_y: 'Spitze Y',
    peak_z: 'Spitze Z',
    frq_x: 'Frq X',
    frq_y: 'Frq Y',
    frq_z: 'Frq Z',
    vsum: 'VSUM',
    downloadURL: 'Herunterladen',
    previewURL: 'Vorschau',
    filter: {
      all: 'Alle',
      evt: 'Events',
      pk: 'Peaks',
      zip: 'Zip'
    }
  },
  dialog: {
    period: 'Periode',
    scale: 'Skala',
    hours: '12 Stunden',
    days: '2 Tage',
    weeks: '2 Wochen',
    months: '1 Monat',
    select_period: 'Periode auswählen',
    perception_level: 'Wahrnehmungsebene',
    alarm_level: 'Alarmlevel',
    highest_peak: 'Höchster Peak',
    enter_value: 'Wert eingeben',
  },
  device_health: {
    title: 'Gesundheitsstatus von',
    battery_voltage: 'Batteriespannung',
    cellular_signal: 'Mobiles Signal',
    main_battery: 'Hauptbatterie',
    good: 'gut',
    fair: 'ausreichend',
    poor: 'schlecht',
  },
  warnings: {
    unassign_device: 'Sind Sie sicher? Dadurch werden alle Daten des Geräts gelöscht!',
    delete_project: 'Sind Sie sicher? Dadurch werden alle Geräte aus diesem Projekt entfernt, und ihre Daten gelöscht!'
  }
};
