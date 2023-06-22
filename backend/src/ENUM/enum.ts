import { registerEnumType } from '@nestjs/graphql';

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

/*
  ======================
    Enum Registrations
  ======================
 */
registerEnumType(USER_ROLE, { name: 'UserRole' });
registerEnumType(LEGAL_FORM, { name: 'LegalForm' });
registerEnumType(DEVICE_TYPE, { name: 'DeviceType' });
registerEnumType(JOB_TYPE, { name: 'JobType' });
registerEnumType(JOB_STATUS, { name: 'JobStatus' });
