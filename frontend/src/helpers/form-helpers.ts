import {computed, Ref, ref} from 'vue';
import {Field, FIELDS} from 'src/data/FIELDS';
import _ from 'lodash';

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

  // Page definitions
  pages: Ref<Record<string, any>[]>

  /**
   * Constructor
   * @param {Array<Record<string, unknown>>} pages - the form's pages
   */
  constructor(pages?: Array<Record<string, unknown>>) {
    this.step = ref(1)
    this.values = ref({})
    this.pages = pages? ref(_.cloneDeep(pages)) : ref([])
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
    const currentPage: Record<string, Record<string, unknown>[]> = this.pages.value[this.step.value - 1]

    // a page can either have just fields or sections with fields, therefore fields need to be defined correspondingly
    const sections = currentPage.sectionsLHS && currentPage.sectionsRHS ? currentPage.sectionsLHS.concat(currentPage.sectionsRHS) : []

    // Fields on current page
    if (!currentPage.fields && sections.some(section => !section.fields)) {
      throw new Error("There aren't any fields defined.");
    }
    let pageFields: Record<string, unknown>[] = currentPage.fields ?? []
    if (pageFields.length === 0){
      pageFields = []
      sections.forEach(section => {
        pageFields = pageFields.concat(section.fields as Record<string, unknown>[])
      })
    }
    pageFields.forEach((field: Record<string, any>) => {
      pageKeys.push(field.key as string)
    })

    // Validate each field by its "rules" attribute
    return pageKeys.every((key) => {
      // If no value present at all, stop check
      if (!this.values.value[key]) return false

      const field: Field = FIELDS[key.toUpperCase()]
      const rules: Array<(valueElement: any) => boolean|string> = field.attributes.rules
      return rules.every((rule: (valueElement: any) => boolean|string) => {
        // If the rule returns true, it is fulfilled (otherwise, it will return an error message)
        return typeof rule(this.values.value[key]) === 'boolean' && rule(this.values.value[key]) === true
      })
    })
  })



  /**
   * Updates a value within the form's values
   * @param {string} key: the value's name
   * @param {unknown} value: the actual value to add
   * @returns {void}
   */
  updateValue(key: string, value: unknown): void {
    this.values.value[key] = value
  }
}
