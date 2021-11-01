import {computed, defineEmits, ref} from 'vue';
import {FIELDS} from 'src/data/FIELDS';

/**
 * Emits the 'submit' event, containing the form's data
 */
function onSubmit(){
  console.log('On submit!')
  emit('submit', form_values.value)
}

const step = ref(1)
const form_values = ref({})
const emit = defineEmits(['submit'])


const pageValid = computed(() => {

  const res = Object.keys(form_values.value).every((key)=>{
    return FIELDS[key.toUpperCase()].attributes.rules.every((rule:()=>boolean)=>{
      console.log('field:', key, ', value:', rule(form_values.value[key]))
      // TODO handle for custom component
      return typeof rule(form_values.value[key]) === 'boolean'
    })
  })

  return res && form_values.value['email'] !== undefined
})


export {
  pageValid,
  onSubmit
}
