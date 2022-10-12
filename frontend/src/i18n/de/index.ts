export default {
  general: {
    finish: 'Abschliessen',
    back: 'Zurück',
    next: 'Weiter',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    ok: 'OK',
    loading: 'Lädt',
    save: 'Speichern',
  },
  authentication: {
    authentication: 'Authentifizierung',
    login: 'Anmelden',
    logout: 'Abmelden',
    signup: 'Registrieren',
    username: 'Benutzername',
    email: 'E-Mail',
    change_password: 'Passwort ändern',
    forgot_password: 'Passwort vergessen',
    verification_code: 'Verifizierungscode',
    password: 'Passwort',
    password_repeat: 'Passwort wiederholen',
    old_password: 'Altes Passwort',
    new_password: 'Neues Passwort',
    new_password_repeat: 'Neues Passwort wiederholen',
    set_up_2fa: 'Zwei-Faktor-Authentifizierung einrichten',
    set_up_2fa_description:
      'Verwenden Sie ihre bevorzugte Authenticator-App, um den QR-Code zu scannen:',
    verification: 'Verifikation',
    verification_message: 'Geben Sie ihren Verifikations-Code ein:',
    resend_code: 'Ich habe keinen Code erhalten',
  },
  errors: {
    module_error: "Fehler: Modul '{module}' ist nicht aktiv",
    invalid_password: 'Bitte geben Sie ein gültiges Passwort ein',
    invalid_email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    invalid_username: 'Bitte geben Sie einen Benutzernamen ein',
    incorrect_password: 'Inkorrektes Passwort',
    incorrect_email: 'Inkorrekte E-Mail-Adresse',
    incorrect_username: 'Inkorrekter Benutzername',
    non_matching_password: 'Passwörter stimmen nicht überein',
    invalid_user_pool: 'User Pool ist ungültig.',
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
    unknown: 'Unbekannter Fehler',
    entry_edit_failed: 'Die Änderung konnte nicht gespeichert werden',
    entry_delete_failed: 'Eintrag konnte nicht gelöscht werden',
  },
  files: {
    add: 'Hinzufügen',
    failed_upload: '{value} Datei(en) konnten nicht hochgeladen werden',
    file_upload: 'File Upload',
    no_preview: 'Keine Vorschau verfügbar',
    remove: 'Entfernen',
    remove_all: 'Alle Dateien entfernen',
    status: 'Status',
    status_ready: 'Bereit',
    status_loading: 'Laden',
    status_done: 'Hochgeladen',
    status_failed: 'Fehler',
    successfully_uploaded: '{value} Datei(en) wurden erfolgreich hochgeladen',
    successfully_deleted: '{value} Datei(en) wurden erfolgreich gelöscht',
    upload: 'Hochladen',
  },
  messages: {
    success: 'Erfolgreich',
    failure: 'Fehlgeschlagen',
    login_failed: 'Login hat fehlgeschlagen',
    email_sent: 'E-Mail(s) versendet',
    file_uploaded: 'Datei erfolgreich hochgeladen',
    files_uploaded: 'Dateien erfolgreich hochgeladen',
    password_set: 'Passwort erfolgreich festgelegt',
    enter_new_password: 'Bitte geben Sie ein neues Passwort ein',
    enter_verification_code:
      'Bitte geben Sie den Verifizierungscode ein, den Sie per E-Mail erhalten haben',
    reset_password: 'Passwort zurücksetzen',
    enter_username: 'Bitte geben Sie ihren Nutzernamen ein:',
    enter_email: 'Bitte geben Sie ihre E-Mail-Adresse ein:',
    verification: 'Verifizierung',
    enter_2fa: 'Geben sie ihren 2-Faktor-Authentifizierungscode ein',
    code_resent: 'Code erfolgreich versendet',
    password_changed:
      'Passwort erfolgreich geändert. Bitte melden Sie sich mit dem neuen Passwort an.',
    account_created: 'Konto erfolgreich erstellt',
    entry_edited: 'Änderung gespeichert',
    entry_deleted: 'Eintrag gelöscht',
  },
  date: {
    date_format: 'DD.MM.YYYY'
  },
  validation: {
    email: 'E-Mail ungültig'
  }
};
