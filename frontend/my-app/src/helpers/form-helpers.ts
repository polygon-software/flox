import {computed, defineEmits, Ref, ref} from 'vue';
import {FIELDS} from 'src/data/FIELDS';

// The current step within a multi-page form
const step: Ref<number> = ref(1)

// The entered values
const values: Ref<Record<string, any>> = ref({})

// Events
const emit = defineEmits(['submit'])

// Page definition (Should get overwritten by each form)
const pages: Ref<Record<string, any>[]> = ref([])

/**
 * Determines whether the current page is filled with valid data
 * (used to determine whether to allow going to next step within form)
 */
const pageValid = computed(() => {
  // If page structure does not exist, page can't be valid
  if(pages.value.length === 0) return false

  // Get keys that should exist in 'values' for this page
  const pageKeys: string[] = []
  // Offset by 1, since step starts at 1
  const pageFields = pages.value[step.value - 1].fields
  pageFields.forEach((field: Record<string, any>) => {
    pageKeys.push(field.key)
  })

  // Validate each field by its "rules" attribute
  return pageKeys.every((key)=>{
    // If no value present at all, stop check
    if(!values.value[key]) return false

    return FIELDS[key.toUpperCase()].attributes.rules.every((rule: (valueElement: any)=>boolean)=>{
      // If the rule returns true, it is fulfilled (otherwise, it will return an error message)
      return typeof rule(values.value[key]) === 'boolean'
    })
  })
})

/**
 * Emits the 'submit' event, containing the form's data
 */
function onSubmit(){
  emit('submit', values.value)
}

/**
 * Updates a value within the form's values
 * @param key {string}: the value's name
 * @param value {any}: the actual value to add
 */
function updateValue(key: string, value: any){
  values.value[key] = value
}

export {
  // Variables
  step,
  values,
  emit,
  pages,
  // Computed
  pageValid,
  // Methods
  onSubmit,
  updateValue
}
