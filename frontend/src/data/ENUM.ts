/* eslint-disable @typescript-eslint/naming-convention */

import { i18n } from 'boot/i18n';

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

export const jobTypeStatuses: Record<JOB_TYPE, JOB_STATUS[]> = {
  [JOB_TYPE.NONE]: [JOB_STATUS.NONE],
  [JOB_TYPE.APPOINTMENT]: [JOB_STATUS.OPEN, JOB_STATUS.TERMINATED],
  [JOB_TYPE.MATERIAL_ORDER]: [
    JOB_STATUS.OPEN,
    JOB_STATUS.ORDERED,
    JOB_STATUS.RECEIVED,
  ],
  [JOB_TYPE.NEW_DEVICES]: [
    JOB_STATUS.OPEN,
    JOB_STATUS.ORDERED,
    JOB_STATUS.RECEIVED,
  ],
  [JOB_TYPE.OFFER]: [JOB_STATUS.OPEN, JOB_STATUS.PENDING, JOB_STATUS.RECEIVED],
  [JOB_TYPE.EXTERNAL_SERVICE]: [
    JOB_STATUS.OPEN,
    JOB_STATUS.PENDING,
    JOB_STATUS.RECEIVED,
  ],
};

/**
 * Returns an array of objects with value and label (translated)
 * @param enumObject - the enum object
 * @param translationKey - the translation key for the enum object (usually in the enum.ts file)
 * @return an array with label and value
 */
export function translatedObjects(
  enumObject: Record<string, string>,
  translationKey: string
): { label: string; value: string }[] {
  return Object.keys(enumObject).map((key) => {
    const label = i18n.global.t(`enum.${translationKey}.${key}`);
    return {
      label,
      value: key,
    };
  });
}

/**
 * Type of field to display in the data table for a boolean value
 */
export enum BOOLEAN_FIELD_TYPE {
  CHECK_BOX = 'CHECK_BOX',
  TOGGLE = 'TOGGLE',
}
