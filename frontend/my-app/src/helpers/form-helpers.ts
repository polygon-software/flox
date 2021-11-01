import {computed, defineEmits, Ref, ref} from 'vue';
import {FIELDS} from 'src/data/FIELDS';



const step: Ref<number> = ref(1)
const values: Ref<Record<string, any>> = ref({})
const emit = defineEmits(['submit'])

/**
 * Determines whether the current page is filled with valid data
 * (used to determine whether to allow going to next step within form)
 */
const pageValid = computed(() => {

  const res = Object.keys(values.value).every((key)=>{
    return FIELDS[key.toUpperCase()].attributes.rules.every((rule: (valueElement: any)=>boolean)=>{
      console.log('field:', key, ', value:', rule(values.value[key]))
      // TODO handle for custom component
      return typeof rule(values.value[key]) === 'boolean'
    })
  })

  return res && values.value['email'] !== undefined
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
  // Computed
  pageValid,
  // Methods
  onSubmit,
  updateValue
}
