import { executeQuery } from 'src/apollo/query';
import { executeMutation } from 'src/apollo/mutation';
import {
  CREATE_FORM,
  DELETE_FORM,
  UPDATE_FORM,
} from 'src/data/form/form.mutation';
import CreateJobInput from 'src/data/job/dto/input/createJobInput';
import CreateClientInput from 'src/data/client/dto/input/createClientInput';
import CreateTenantInput from 'src/data/tenant/dto/input/createTenantInput';
import CreateDeviceInput from 'src/data/device/dto/input/createDeviceInput';
import CreateArticleInput from 'src/data/article/dto/input/createArticleInput';
import CreateExpenseInput from 'src/data/expense/dto/input/createExpenseInput';
import CreateBillingInput from 'src/data/billing/dto/input/createBillingInput';
import UpdateJobInput from 'src/data/job/dto/input/updateJobInput';
import UpdateClientInput from 'src/data/client/dto/input/updateClientInput';
import UpdateTenantInput from 'src/data/tenant/dto/input/updateTenantInput';
import UpdateBillingInput from 'src/data/billing/dto/input/updateBillingInput';
import UpdateDeviceInput from 'src/data/device/dto/input/updateDeviceInput';
import UpdateArticleInput from 'src/data/article/dto/input/updateArticleInput';
import UpdateExpenseInput from 'src/data/expense/dto/input/updateExpenseInput';

import FormEntity from '../entities/form.entity';
import { ALL_FORMS, FORM } from '../form.query';

/**
 * Creates a new form
 *
 * @param job -  Job input data
 * @param startDate - Date the form is created
 * @param endDate - Date the form is resolved
 * @param internalOrderNumber - Internal order number
 * @param externalOrderNumber - External order number
 * @param client - Client
 * @param owner - Owner
 * @param objectNumber - Object number
 * @param tenant - Tenant
 * @param measurePower - Measure power
 * @param billing - Billing
 * @param description - Description
 * @param devices - Devices
 * @param protocolDate - Protocol date
 * @param protcolText - Protocol text
 * @param articles - Articles
 * @param expenses - Expenses
 * @param totalAmount - Total amount
 * @param employeeId - Employee id
 * @param freeText - Free text
 * @param isEmergency - Is emergency
 * @returns - The newly created form or null if the creation failed
 */
export async function createForm(
  job?: CreateJobInput,
  startDate?: Date,
  endDate?: Date,
  internalOrderNumber?: number,
  externalOrderNumber?: number,
  client?: CreateClientInput,
  owner?: string,
  objectNumber?: number,
  tenant?: CreateTenantInput,
  measurePower?: boolean,
  billing?: CreateBillingInput,
  description?: string,
  devices?: CreateDeviceInput[],
  protocolDate?: Date,
  protcolText?: string,
  articles?: CreateArticleInput[],
  expenses?: CreateExpenseInput[],
  totalAmount?: number,
  employeeId?: string,
  freeText?: string,
  isEmergency?: boolean
): Promise<FormEntity | null> {
  const { data } = await executeMutation<FormEntity>(CREATE_FORM, {
    job,
    startDate,
    endDate,
    internalOrderNumber,
    externalOrderNumber,
    client,
    owner,
    objectNumber,
    tenant,
    measurePower,
    billing,
    description,
    devices,
    protocolDate,
    protcolText,
    articles,
    expenses,
    totalAmount,
    employeeId,
    freeText,
    isEmergency,
  });
  return data ?? null;
}

/**
 * Updates an exisiting form
 *
 * @param job -  Job input data
 * @param startDate - Date the form is created
 * @param endDate - Date the form is resolved
 * @param internalOrderNumber - Internal order number
 * @param externalOrderNumber - External order number
 * @param client - Client
 * @param owner - Owner
 * @param objectNumber - Object number
 * @param tenant - Tenant
 * @param measurePower - Measure power
 * @param billing - Billing
 * @param description - Description
 * @param devices - Devices
 * @param protocolDate - Protocol date
 * @param protcolText - Protocol text
 * @param articles - Articles
 * @param expenses - Expenses
 * @param totalAmount - Total amount
 * @param employeeId - Employee id
 * @param freeText - Free text
 * @param isPullable - Is pullable by ERP
 * @param isEmergency - Is emergency
 * @param isFinished - Job is finished
 * @returns - The updated form or null if the update failed
 */
export async function updateForm(
  job?: UpdateJobInput,
  startDate?: Date,
  endDate?: Date,
  internalOrderNumber?: number,
  externalOrderNumber?: number,
  client?: UpdateClientInput,
  owner?: string,
  objectNumber?: number,
  tenant?: UpdateTenantInput,
  measurePower?: boolean,
  billing?: UpdateBillingInput,
  description?: string,
  devices?: UpdateDeviceInput[],
  protocolDate?: Date,
  protcolText?: string,
  articles?: UpdateArticleInput[],
  expenses?: UpdateExpenseInput[],
  totalAmount?: number,
  employeeId?: string,
  freeText?: string,
  isPullable?: boolean,
  isEmergency?: boolean,
  isFinished?: boolean
): Promise<FormEntity | null> {
  const { data } = await executeMutation<FormEntity>(UPDATE_FORM, {
    job,
    startDate,
    endDate,
    internalOrderNumber,
    externalOrderNumber,
    client,
    owner,
    objectNumber,
    tenant,
    measurePower,
    billing,
    description,
    devices,
    protocolDate,
    protcolText,
    articles,
    expenses,
    totalAmount,
    employeeId,
    freeText,
    isPullable,
    isEmergency,
    isFinished,
  });
  return data ?? null;
}

/**
 * Deletes a form
 *
 * @param uuid - uuid of form
 * @returns - The deleted form or null if the deletion failed
 */
export async function deleteForm(uuid: string): Promise<FormEntity | null> {
  const { data } = await executeMutation<FormEntity>(DELETE_FORM, {
    uuid,
  });
  return data ?? null;
}

/**
 * Fetches a form
 *
 * @param uuid - uuid of form
 * @returns Private File
 */
export async function getForm(uuid: string): Promise<FormEntity> {
  const { data } = await executeQuery<FormEntity>(FORM, {
    uuid,
  });
  return data;
}

/**
 * Fetches all forms
 *
 * @returns all forms
 */
export async function getAllForms(): Promise<FormEntity[]> {
  const { data } = await executeQuery<FormEntity[]>(ALL_FORMS);
  return data;
}
