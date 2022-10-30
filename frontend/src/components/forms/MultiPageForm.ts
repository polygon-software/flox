import cloneDeep from 'lodash/cloneDeep';
import { computed, Ref, ref } from 'vue';

import { Field } from 'src/flox/modules/auth/components/forms/fields';

export interface FormPage {
  key: string;
  label: string;
  fields: Field[];
}

/**
 * The Form class is meant to be used by any form components.
 * To use its functionality, they must (in their <script setup>) create a new instance and
 * declare its pages, e.g.:
 *
 * const form = new Form()
 * form.pages.value = [ ... ]
 */
export class MultiPageForm {
  // The current step within a multipage form
  step: Ref<number>;

  // The entered values
  values: Ref<Record<string, any>>;

  // Page definitions
  pages: Ref<FormPage[]>;

  /**
   * Constructor
   * @param pages - the form's pages
   */
  constructor(pages?: FormPage[]) {
    this.step = ref(1);
    this.values = ref({});
    this.pages = pages ? ref(cloneDeep(pages)) : ref([]);
  }

  /**
   * Determines whether the current page is filled with valid data
   * (used to determine whether to allow going to next step within form)
   */
  pageValid = computed(() => {
    // If page structure does not exist, page can't be valid
    if (this.pages.value.length === 0) {
      return false;
    }

    // Offset by 1, since step starts at 1
    const currentPage: FormPage = this.pages.value[this.step.value - 1];

    // Validate each field by its "rules" attribute
    return currentPage.fields.every((field) => {
      // If no value present at all, stop check
      if (!this.values.value[field.key]) {
        return false;
      }

      const rules = field.attributes.rules;
      return rules.every((rule) => {
        // If the rule returns true, it is fulfilled (otherwise, it will return an error message)
        if (typeof rule === 'function') {
          return rule(this.values.value[field.key]) === true;
        } else {
          return true;
        }
      });
    });
  });

  /**
   * Updates a value within the form's values
   * @param key - the value's name
   * @param value - the actual value to add
   */
  updateValue(key: string, value: unknown): void {
    this.values.value[key] = value;
  }
}
