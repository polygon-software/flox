import {computed, defineEmits, Ref, ref} from 'vue';
import {FIELDS} from 'src/data/FIELDS';

/**
 * The Form class is meant to be used by any form components.
 * To use its functionality, they must (in their <script setup>) create a new instance and
 * declare its pages, e.g.:
 *
 * const form = new Form()
 * form.pages.value = [ ... ]
 */
export class Form {
  // The current step within a multi-page form
  step: Ref<number>

  // The entered values
  values: Ref<Record<string, any>>

  // Events
  emit: {(e: 'submit', values: Record<string, unknown>): void}

  // Page definitions
  pages: Ref<Record<string, any>[]>

  constructor() {
    this.step = ref(1)
    this.values = ref({})
    this.emit = defineEmits(['submit'])
    this.pages = ref([])
  }



  /**
   * Determines whether the current page is filled with valid data
   * (used to determine whether to allow going to next step within form)
   */
  pageValid = computed(() => {
    // If page structure does not exist, page can't be valid
    if (this.pages.value.length === 0) return false

    // Get keys that should exist in 'values' for this page
    const pageKeys: string[] = []
    // Offset by 1, since step starts at 1
    const pageFields: Record<string, unknown>[] = this.pages.value[this.step.value - 1].fields
    pageFields.forEach((field: Record<string, any>) => {
      pageKeys.push(field.key)
    })

    // Validate each field by its "rules" attribute
    return pageKeys.every((key) => {
      // If no value present at all, stop check
      if (!this.values.value[key]) return false

      const fieldAttributes: Record<string, any> = FIELDS[key.toUpperCase()].attributes
      const rules: Array<(valueElement: any) => boolean|string> = fieldAttributes.rules
      return rules.every((rule: (valueElement: any) => boolean|string) => {
        // If the rule returns true, it is fulfilled (otherwise, it will return an error message)
        const result = typeof rule(this.values.value[key]) === 'boolean'
        return result
      })
    })
  })

  /**
   * Emits the 'submit' event, containing the form's data
   */
  onSubmit(): void {
    this.emit('submit', this.values.value)
  }

  /**
   * Updates a value within the form's values
   * @param key {string}: the value's name
   * @param value {unknown}: the actual value to add
   */
  updateValue(key: string, value: unknown): void {
    this.values.value[key] = value
  }
}
