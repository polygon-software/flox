import { defineStore } from 'pinia';

// Type for props, so linter can correctly infer functions
export type FormStore = {
  data: FormStoreContents;
  setValue(
    pageKey: string,
    cardKey: string,
    fieldKey: string,
    value: unknown
  ): void;
};

// Form store content: formKey -> pageKey -> cardKey -> fieldKey -> actual value
export type FormStoreContents = Record<
  string,
  Record<string, Record<string, Record<string, unknown>>>
>;

// State interface
export interface FormState {
  data: FormStoreContents;
}

// Access key for a formPages value
export type FormStateKey = {
  formKey: string;
  pageKey: string;
  cardKey: string;
  fieldKey: string;
};

export const useFormStore = defineStore('formState', {
  state: (): FormState => ({
    data: {} as FormStoreContents, // Initialized to empty, filled by GenericForm
  }),

  actions: {
    /**
     * Persists a value to the store
     * @param {FormStateKey} key - access key
     * @param {unknown} value - value to store
     * @returns void
     */
    setValue(key: FormStateKey, value: unknown): void {
      this.data[key.formKey][key.pageKey][key.cardKey][key.fieldKey] = value;
    },

    /**
     * Clears all data for the given formPages from the store
     * @param {string} formKey - formPages key
     * @returns void
     */
    clearForm(formKey: string) {
      delete this.data[formKey];
    },
  },
  getters: {
    getForm: (state) => {
      return (key: string): Record<string, unknown> => state.data[key];
    },
    getField: (state) => {
      return (key: FormStateKey): unknown =>
        state.data[key.formKey][key.pageKey][key.cardKey][key.fieldKey];
    },
  },
});
