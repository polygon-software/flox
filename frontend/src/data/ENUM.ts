/* eslint-disable @typescript-eslint/naming-convention */

/**
 * User roles for the application
 */
export enum USER_ROLE {
  ADMIN = 'ADMIN',
  INTERNAL_EMPLOYEE = 'INTERNAL_EMPLOYEE',
  EXTERNAL_EMPLOYEE = 'EXTERNAL_EMPLOYEE',
}

/**
 * Legal forms of client companies
 */
export enum LEGAL_FORM {
  LIMITED_PARTNERSHIP = 'LIMITED_PARTNERSHIP',
  PUBLIC_COMPANY = 'PUBLIC_COMPANY',
  LLC = 'LLC',
  COOPERATIVE = 'COOPERATIVE',
  INDIVIDUAL_COMPANY = 'INDIVIDUAL_COMPANY',
}

/*
 * Types of devices that need to be repaired
 */
export enum DEVICE_TYPE {
  WASHING_MACHNE = 'WASHING_MACHNE',
  TUMBLE_DRYER = 'TUMBLE_DRYER',
  DISHWASHER = 'DISHWASHER',
  FRIDGE = 'FRIDGE',
  OVEN = 'OVEN',
  STOVE = 'STOVE',
  STEAMER = 'STEAMER',
  MICROWAVE = 'MICROWAVE',
  VENTILATION = 'VENTILATION',
  HOB = 'HOB',
  OTHER = 'OTHER',
}

/**
 * Type of floor a client lives on
 */
export enum FLOOR {
  BASEMENT = 'BASEMENT',
  GROUND_FLOOR = 'GROUND_FLOOR',
  UPPER_FLOOR = 'UPPER_FLOOR',
}

/**
 * Type of repair job
 */
export enum JOB_TYPE {
  NONE = 'NONE',
  APPOINTMENT = 'APPOINTMENT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  MATERIAL_ORDER = 'MATERIAL_ORDER',
  NEW_DEVICES = 'NEW_DEVICES',
  OFFER = 'OFFER',
}

/**
 * Status of a repair job
 */
export enum JOB_STATUS {
  NONE = 'NONE',
  OPEN = 'OPEN',
  TERMINATED = 'TERMINATED',
  ORDERED = 'ORDERED',
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
}
