import { executeQuery } from 'src/apollo/query';
import { executeMutation } from 'src/apollo/mutation';
import {
  CREATE_FORM,
  DELETE_FORM,
  UPDATE_FORM,
} from 'src/data/form/form.mutation';
import FormEntityInput from 'src/data/form/dto/input/createFormEntityInput';

import FormEntity from '../entities/form.entity';
import { FORM, SEARCH_FORMS } from '../form.query';

/**
 * Creates a new form
 *
 * @returns - The newly created form or null if the creation failed
 * @param input
 */
export async function createForm(
  input: FormEntityInput
): Promise<FormEntity | null> {
  const { data } = await executeMutation<FormEntity>(
    CREATE_FORM,
    input as unknown as Record<string, unknown>
  );
  return (data as FormEntity) ?? null;
}

/**
 * Updates an exisiting form
 *
 * @returns - The updated form or null if the update failed
 * @param input
 */
export async function updateForm(
  input: FormEntityInput
): Promise<FormEntity | null> {
  const { data } = await executeMutation<FormEntity>(
    UPDATE_FORM,
    input as unknown as Record<string, unknown>
  );
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
    softDelete: false,
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
  const { data } = await executeQuery<FormEntity[]>(SEARCH_FORMS);
  return data;
}
