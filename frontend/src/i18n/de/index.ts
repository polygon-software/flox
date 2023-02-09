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
    finish: 'Abschliessen',
    back: 'Zurück',
    next: 'Weiter',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    ok: 'OK',
    loading: 'Lädt',
    failed: 'Fehlgeschlagen',
    successful: 'Erfolgreich',
    save: 'Speichern',
    create: 'Erstellen',
    apply: 'Anwenden',
    remove: 'Entfernen',
    results: 'Resultate',
    no_results: 'Keine Resultate',
    search: 'Suchen',
    display: 'Anzeigen',
    sample: 'Beispiel',
  },
  locales: {
    de: 'Deutsch',
    en: 'Englisch',
  },
  users: {
    users: 'Benutzer',
    avatar: 'Avatar',
    username: 'Benutzername',
    email: 'E-Mail',
    role: 'Rolle',
  },
  object_recognition: {
    description:
      'Unsere Objekt-Erkennung analysiert Bilder und kann bis zu 5000 verschiedene Objekte identifizieren.',
    import_images: 'Bilder importieren',
    search_files: 'Dateien suchen',
    object_recognition: 'Object Recognition',
    image_already_imported: 'Bild wurde bereits importiert',
    image_imported: 'Import erfolgreich',
    not_image: 'Import fehlgeschlagen - Datei ist kein Bild',
  },
  payment: {
    payment: 'Bezahlung',
    payments: 'Bezahlungen',
    payment_details: 'Details zur Bezahlung',
    payment_date: 'Datum',
    currency: 'Währung',
    test_payment: 'Testzahlung tätigen',
    pay: 'Bezahlen',
    pay_amount: 'Bezahlen ({amount})',
    succeeded: 'Bezahlung erfolgreich',
    failed: 'Bezahlung fehlgeschlagen',
    buyer: 'Käufer',
    product: 'Produkt',
    amount: 'Betrag',
    date: 'Datum',
    status: 'Status',
    avatar: 'Avatar',
    pending: 'Ausstehend',
    success: 'Erfolgreich',
    error: 'Fehlgeschlagen',
  },
  date: {
    date_format: 'DD.MM.YYYY',
  },
  validation: {
    email: 'E-Mail ungültig',
  },
  table: {
    ctrl_shift_hint:
      'Hinweis: Verwende SHIFT um einen Bereich auszuwählen und CTRL um einzelne Elemente zu selektieren',
  },
  pages: {
    home: {
      title: 'Home',
      meta: {
        title: 'Flox',
        description: 'Dies ist eine flox demo-seite',
        keywords: 'flox,demo,polygon',
      },
    },
  },
  menu: {
    home: 'Home',
    users: 'Benutzer',
    access_rights: 'Zugriffsrechte',
    alias: 'Alias',
    files: 'Dateien',
    object_recognition: 'Objekterkennung',
    face_recognition: 'Gesichtserkennung',
    text_extraction: 'Text Extraktion',
    settings: 'Einstellungen',
    admin_panel: 'Administrator-Sektion',
    payment: 'Bezahlungen',
  },
  footer: {
    developers: 'Entwickler',
    privacy: 'Privatsphäre',
    terms: 'AGBs',
  },
  alias: {
    alias: 'Alias',
    active: 'Aktiver Alias',
    set_alias: 'Alias setzen',
    remove_alias: 'Alias entfernen',
    users: 'Benutzer',
    avatar: 'Avatar',
    logged_in_as: 'Momentan eingeloggt als',
    alias_on_user:
      'Du siehst die Applikation momentan mit einem aktiven Alias auf den User mit der ID',
    description:
      'Dieses Modul kann verwendet werden um die Applikation aus der Sicht eines anderen Benutzers zu erleben. Diese Funktion ist nur für Administratoren freigeschaltet.',
  },
  admin_panel: {
    admin_panel: 'Administrator-Sektion',
    system_notification: 'Systembenachrichtigungen',
    broadcast_message:
      'Benachrichtige Benutzer in deinem System über Updates, Downtime oder Neuerungen. Achtung: Diese Nachrichten werden an alle Benutzer versendet und sollten daher nur in Ausnahmefällen verschickt werden.',
  },
  access_control: {
    users: 'Benutzer',
    remove_user: 'Benutzer entfernen',
    add_users: 'Benutzer hinzufügen',
    access_control: 'Zugriffs-Kontrolle',
    invalid_group_name: 'Gruppenname nicht erlaubt',
    create_group: 'Neue Zugriffsgruppe erstellen',
    access_groups: 'Zugriffsgruppen',
    add_group: 'Gruppe hinzufügen',
    group_name: 'Gruppenname',
    delete_group: 'Gruppe löschen',
    add_to_group: 'Zu Gruppe hinzufügen',
    group_name_label: 'Neuer Gruppenname',
    select_users: 'Benutzer auswählen',
    manage_groups: 'Zugriffsgruppen verwalten',
    search_groups: 'Zugriffsgruppe suchen',
    no_access_groups: 'Noch keine Zugriffsgruppen definiert',
    read: 'Lesen',
    write: 'Schreiben',
    create_description:
      'Erstelle eine neue Zugriffsgruppe indem du ihr einen Namen gibst und Benutzer als Mitglieder definierst. Du kannst später jederzeit Mitglieder hinzufügen/entfernen.',
  },
};
