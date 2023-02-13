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
    yes: 'Ja',
    no: 'Nein',
  },
  locales: {
    de: 'Deutsch',
    en: 'Englisch',
  },
  users: {
    all_users: 'Alle Benutzer',
    users: 'Benutzer',
    avatar: 'Avatar',
    username: 'Benutzername',
    email: 'E-Mail',
    role: 'Rolle',
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
};
