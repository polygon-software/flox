// ENUM translations
/* eslint-disable camelcase */

export default {
  enum: {
    job_status: {
      NONE: 'Kein',
      OPEN: 'Offen',
      TERMINATED: 'Terminiert',
      ORDERED: 'Bestellt',
      PENDING: 'Pendent',
      RECEIVED: 'Eingegangen',
    },
    job_type: {
      NONE: 'Kein',
      APPOINTMENT: 'Termin',
      EXTERNAL_SERVICE: 'Fremdservice',
      MATERIAL_ORDER: 'Materialbestellung',
      NEW_DEVICES: 'Neugeräte',
      OFFER: 'Offerte',
    },
    floor: {
      BASEMENT: 'Keller',
      GROUND_FLOOR: 'Erdgeschoss',
      UPPER_FLOOR: 'Obergeschoss',
    },
    device_type: {
      WASHING_MACHNE: 'Waschmaschine',
      TUMBLE_DRYER: 'Trockner',
      DISHWASHER: 'Geschirrspüler',
      FRIDGE: 'Kühlschrank',
      OVEN: 'Ofen',
      STOVE: 'Herd',
      STEAMER: 'Dampfgarer',
      MICROWAVE: 'Mikrowelle',
      VENTILATION: 'Lüftung',
      HOB: 'Kochfeld',
      OTHER: 'Sonstiges',
    },
    legal_form: {
      LIMITED_PARTNERSHIP: 'Kommanditgesellschaft',
      PUBLIC_COMPANY: 'Aktiengesellschaft',
      LLC: 'GmbH',
      COOPERATIVE: 'Genossenschaft',
      INDIVIDUAL_COMPANY: 'Einzelunternehmen',
    },
    user_role: {
      ADMIN: 'Administrator',
      INTERNAL_EMPLOYEE: 'Interne/r Mitarbeiter/in',
      EXTERNAL_EMPLOYEE: 'Externe/r Mitarbeiter/in',
    },
  },
};
