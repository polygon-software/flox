import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageSchema = typeof messages.de;

const i18n = createI18n<[MessageSchema], 'de' | 'en', false>({
  legacy: false,
  globalInjection: true,
  locale: 'de',
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
