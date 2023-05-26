// ENUM translations
/* eslint-disable camelcase */

export default {
  enum: {
    job_status: {
      NONE: 'None',
      OPEN: 'Open',
      TERMINATED: 'Terminated',
      ORDERED: 'Ordered',
      PENDING: 'Pending',
      RECEIVED: 'Received',
    },
    job_type: {
      NONE: 'None',
      APPOINTMENT: 'Appointment',
      EXTERNAL_SERVICE: 'External service',
      MATERIAL_ORDER: 'Material order',
      NEW_DEVICES: 'New devices',
      OFFER: 'Offer',
    },
    floor: {
      BASEMENT: 'Basement',
      GROUND_FLOOR: 'Ground floor',
      UPPER_FLOOR: 'Upper floor',
    },
    device_type: {
      WASHING_MACHNE: 'Washing machine',
      TUMBLE_DRYER: 'Tumble dryer',
      DISHWASHER: 'Dishwasher',
      FRIDGE: 'Fridge',
      OVEN: 'Oven',
      STOVE: 'Stove',
      STEAMER: 'Steamer',
      MICROWAVE: 'Microwave',
      VENTILATION: 'Ventilation',
      HOB: 'Hob',
      OTHER: 'Other',
    },
    legal_form: {
      LIMITED_PARTNERSHIP: 'Limited partnership',
      PUBLIC_COMPANY: 'Public company',
      LLC: 'LLC',
      COOPERATIVE: 'Cooperative',
      INDIVIDUAL_COMPANY: 'Individual company',
    },
    user_role: {
      ADMIN: 'Admin',
      INTERNAL_EMPLOYEE: 'Internal employee',
      EXTERNAL_EMPLOYEE: 'External employee',
    },
  },
};
