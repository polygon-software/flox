import { cloneDeep } from 'lodash-es';

import { FormStateKey, useFormStore } from '../stores/form';
import FormPage from '../data/types/FormPage';

/**
 * Set up an empty store sub-structure for a given formPages structure
 * @param formKey - formPages name
 * @param pages - formPages pages
 * @param preserveState - whether to maintain any preexisting store values
 */
export function buildStoreSubstructure(
  formKey: string,
  pages: FormPage[],
  preserveState: boolean
): void {
  const store = useFormStore();

  // Set up formPages

  if (!store.data[formKey]) {
    store.data[formKey] = {};
  }

  // For every page, build substructure
  pages.forEach((page) => {
    // Set up page
    if (!store.data[formKey][page.key]) {
      store.data[formKey][page.key] = {};
    }

    // For every card, build substructure
    page.cards.forEach((card) => {
      // Set up card
      if (!store.data[formKey][page.key][card.key]) {
        store.data[formKey][page.key][card.key] = {};
      }
      // For every card, build object with its field values
      card.fields.forEach((field) => {
        // Ensure invalid/null fields cannot be present in cards
        if (!field) {
          throw new Error(
            `Error setting up form store: Form '${formKey}', page '${page.key}', card '${card.key}' contains invalid fields!`
          );
        }

        const preexistingValue =
          store.data[formKey][page.key][card.key]?.[field.key];

        // Initialize all fields to null if not given (or if formPages doesn't require them to be preserved)
        if (
          !preserveState ||
          preexistingValue === null ||
          preexistingValue === undefined
        ) {
          store.data[formKey][page.key][card.key][field.key] = null;
        }
      });
    });
  });
}

/**
 * Gets values from store, if present
 * @param key - formPages field access key
 * @returns data if it exists, null otherwise
 */
export function fetchByKey(key: FormStateKey): unknown | null {
  if (!key) {
    return null;
  }

  const store = useFormStore();
  const result =
    store.data[key.formKey]?.[key.pageKey]?.[key.cardKey]?.[key.fieldKey];
  if (result === undefined || result === null) {
    return null;
  }
  // Return cloned, so values can be used as v-model without issues
  return cloneDeep(result);
}
