export default {
  general: {
    yes: 'Ja',
    no: 'Nein',
    new: 'Neu',
    editable: 'bearbeitbar',
    search: 'Suche',
    welcome: 'Willkommen',
    from: 'Von',
    to: 'Bis',
    date: 'Datum',
    return: 'Zurück'
  },
  authentication: {
    loggedIn: 'Angemeldet als {user}',
    login: 'Anmelden',
    logout: 'Abmelden',
    signup: 'Registrieren',
    bank_signup: 'Bank erfassen',
    employee_signup: 'Mitarbeitende erfassen',
    signup_now: 'Kein Account? Jetzt registrieren:',
    forgot_password: 'Passwort vergessen',
    redirected: 'Sie werden in Kürze weitergeleitet...',
    successful_application: 'Ihr Auftrag wurde erfolgreich entgegengenommen.',
    confirmed_registration: 'Registrierung bestätigt',
    redirect_to_login: 'Ihre Registrierung wird nun bearbeitet! Sie werden nun automatisch zum Login-Screen zurückgeleitet.',
    back_to_login: 'Zurück zu Login',
    change_password: 'Passwort ändern',
    unauthenticated: 'Nicht Angemeldet'

  },
  account_data: {
    employees: 'Mitarbeitende',
    authentication: 'Authentifizierung',
    broker: 'Broker',
    email: 'E-Mail',
    username: 'Benutzername',
    password: 'Passwort',
    repeat_password: 'Passwort wiederholen',
    account: 'Account',
    activities: 'Aktivitäten',
    personal: 'Persönliches',
    address: 'Addresse',
    street: 'Strasse',
    number: 'Nummer',
    zip_code: 'Postleitzahl',
    city: 'Ort',
    interests: 'Interessen',
    company: 'Firma',
    first_name: 'Vorname',
    last_name: 'Nachname',
    full_name: 'Name',
    company_name: 'Firmenname',
    company_uid: 'Firmen UID',
    id: 'ID',
    institution: 'Institut',
    supervisor: 'Verantworliche*r',
    date: 'Datum',
    status: 'Status',
    language: 'Sprache',
    domicile_address: 'Addresse',
    correspondence_address: 'Korrespondenzaddresse',
    edit_correspondence_address: 'Gleich wie Wohnadresse',
    phone_number: 'Telefonnummer',
    branch_structure: 'Niederlassungsstruktur',
    conditions: 'AGB',
    accept_conditions: 'Ich stimme den AGB zu.',
    salutation: 'Anrede',
    company_function: 'Funktion in der Firma',
    accept_condition_truthful: 'Alle Angaben sind wahrheitsgetreu ausgefüllt.',
    passport_or_id: 'Ausweiskopie',
    commercial_register_extract: 'Handelsregisterauszug',
    execution_register_extract: 'Betreibungsregisterauszug',
    optional: 'optional',
    offer: 'Antrag',
    abbreviation: 'Kürzel',
    tasks: 'Aufträge',
    volume: 'Volumen',
    mortgage_volume: 'Hypothekarvolumen',
    provision: 'Provision | Provisionen',
    provision_employee: 'Provision MA',
    provision_company: 'Provision Organisation',
    provision_soi: 'Provision SOI',
    provision_ratio: 'Anteil prov. Vermittler',
    bank: 'Bank | Banken',
  },
  messages: {
    account_unlocked: 'Account erfolgreich freigeschaltet',
    document_upload_enabled: 'Dokumentupload freigeschaltet',
    application_rejected: 'Antrag abgelehnt',
    rejection_failed: 'Ein Fehler ist beim Ablehnen aufgetreten',
    success: 'Erfolgreich',
    failure: 'Fehlgeschlagen',
    login_failed: 'Login hat fehlgeschlagen',
    dossier_reset: 'Dossier erfolgreich zurückgesetzt',
    dossier_reset_failed: 'Zurücksetzen des Dossiers fehlgeschlagen',
  },
  dashboards: {
    management_dashboard: 'Chef Dashboard',
    offer: 'Offerte | Offerten',
    register_new_employee_here: 'Melden Sie hier eine*n neue*n Mitarbeitenden an:',
    application: 'Antrag | Anträge',
    state: 'Status',
    action: 'Aktion',
    enable_upload: 'Upload freigeben',
    unlock_account: 'Konto freischalten',
    reject: 'Ablehnen',
    sure_to_reject: 'Sind Sie sicher, dass Sie diese Anfrage ablehnen möchten?',
    yes_reject: 'Ja, ablehnen',
    view_documents: 'Dokumente ansehen',
    employee_tasks: 'Mitarbeitendenaufträge',
    dossier: 'Dossier | Dossiers',
    offer_id: 'Auftr. Nr.',
    market_value: 'Verkehrswert',
    mortgage: 'Hypothek',
    b_degree: 'B-Grad',
    acceptability_of_risks: 'Tragbarkeit',
    expiration: 'Ablauf',
  },
  buttons: {
    finish_signup: 'Abschliessen',
    finish: 'Abschliessen',
    back: 'Zurück',
    next_step: 'Weiter',
    submit: 'Senden',
    cancel: 'Abbrechen',
    ok: 'OK',
    download: 'Herunterladen',
    preview: 'Vorschau',
  },
  documents: {
    documents_available: 'Dokumente verfügbar',
    document_upload: 'Dokumentenupload',
    additional_documents: 'Weitere Dokumente',
    add_additional_documents: 'Weitere hinzufügen',
  },
  dossier: {
    reset_dossier: 'Dossier zurücksetzen',
    reset_dossier_description: 'Dossier wird zurückgesetzt und alle darauf erstellten Offerten gelöscht.',
    offer: 'offerieren',
    send_offer: 'Offerte senden',
    upload_offer: 'Offertendokumente hochladen',
  },
  errors: {
    nothing_here: 'Hoppla. Hier hat es nichts...',
    user_not_defined: 'Benutzerpool ist nicht definiert',
    missing_properties: 'Eine oder mehrere der folgenden Eigenschaften fehlen für die angegebene Mutation: \'mutation\', \'tables\', \'type\', \'cacheLocation\'',
    not_logged_in: 'Versucht, sich abzumelden, obwohl man nicht eingeloggt ist!',
    error_occurred: 'Ein Fehler ist aufgetreten, versuchen Sie sich erneut anzumelden',
    cant_find_module: 'Kann Modul nicht finden ',
    cache_location_missing: 'Cache-Speicherort fehlt in mutationObject: ',
    missing_attributes: 'Fehlende Attribute',
    incorrect_email: 'E-Mail Adresse wurde nicht gefunden',
    incorrect_username: 'Benutzername wurde nicht gefunden',
    non_matching_password: 'Passwörter stimmen nicht überein',
    invalid_abbreviation: 'Bitte geben Sie ein gültiges Kürzel ein',
    invalid_name: 'Bitte geben Sie Ihren Namen ein',
    invalid_password: 'Bitte geben Sie ein gültiges Passwort ein',
    invalid_email: 'Bitte geben Sie eine gütlige E-Mail Adresse ein',
    invalid_username: 'Bitte geben Sie einen Benutzernamen ein',
    invalid_link: 'Der Link den Sie verwendet haben ist ungültig oder wurde bereits verwendet.',
    incorrect_password: 'Inkorrektes Passwort',
    invalid_address: 'Bitte geben Sie eine gültige Addresse ein',
    invalid_city: 'Bitte geben Sie einen gültigen Ort ein',
    invalid_house_number: 'Diese Nummer existiert nicht',
    invalid_zip_code: 'Bitte geben Sie eine gültige Postleitzahl ein',
    invalid_phone_number: 'Bitte geben Sie eine gültige Telefonnummer ein',
    invalid_option: 'Bitte wählen Sie eine gültige Option.',
    invalid_company_name: 'Bitte geben Sie Ihren Firmennamen ein',
    invalid_company_uid: 'Bitte geben Sie die UID Ihrer Firma ein',
    must_accept_conditions: 'Sie müssen den AGBs zustimmen.',
    must_accept_condition_truthful: 'Sie müssen alle Angaben wahrheitsgetreu aufgefüllt haben.',
    missing_file: 'Datei fehlt',
    missing_user_type: 'Bitte wählen Sie eine Benutzerklasse',
    documents_missing: 'Fehlende Dokumente',
    offer_already_present: 'Sie haben dieses Dossier bereits markiert.',
    unknown: 'Unbekannter Fehler'
  },
  set_password: {
    description: 'Da dies dein erster Login ist, bitten wir dich, ein Passwort zu setzen.',
  },
  status: {
    uploading: 'Hochladen',
    loading: 'Laden',
    offered: 'Offeriert',
    offer_rejected: 'Offerte abgelehnt',
    offer_withdrawn: 'Offerte zurückziehen',
    in_progress: 'Kreditvertrag in Bearbeitung',
    sent: 'Kreditvertrag versendet',
    signed: 'Kreditvertrag unterzeichnet',
    completed: 'abgeschlossen',
    offer: {
      offered: 'offerieren',
      withdrawn: 'zurückgezogen',
      rejected: 'abgelehnt',
    }
  },
  user_types: {
    soi_admin: 'SOI Administrator',
    manager: 'Manager',
    employee: 'Mitarbeiter',
  },
  employee_dashboard: {
    title: 'Mitarbeiter Dashboard',
    applications: 'Anträge',
    search: 'Suche',
    new_assignment: 'Neuen Auftrag erfassen',
    date: 'Datum',
    customer: 'Kunde',
    institute: 'Institut',
    location: 'Ort',
    mortgage_amount: 'Hypothekarbetrag CHF',
    status: 'Status',
    uploads: 'Dokumente',
    all_documents: 'Alle Dokumente',
    offers: 'Angebote',
    'non-arrangeable': 'Nicht vermittelbar',
    upload_more_documents: 'Weitere Dokumente hochladen',
    organisation_id: 'Organisationsnummer',
    employee_id: 'Mitarbeiternummer',
    role: 'Rolle',
  },
  dossier_status_enum: {
    OPEN: 'Offen',
    SIGNED: 'Kreditvertrag unterzeichnet zurück',
    REJECTED: 'Offerte abgelehnt',
    SUBMITTED: 'Eingereicht',
    OFFERED: 'Offeriert',
    COMPLETED: 'Abgeschlossen',
    IN_PROGRESS: 'Kreditvertrag in Bearbeitung',
    SENT: 'Kreditvertrag versendet',
  },
  offer_status_enum: {
    INTERESTED: 'Interessiert',
    RETRACTED: 'Zurückgezogen',
    ACCEPTED: 'Akzeptiert',
    IN_PROCESS: 'In Bearbeitung'
  },
  email: {
    subject_rejected: 'Abgelehnt',
    body_rejected: 'Die Applikation wurde abgelehnt'
  },

  bank: {
    new_user: 'Neuer Benutzer'
  }
};
