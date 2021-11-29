<template>
  <q-page class="flex flex-center">
    <div class="column">
      <GenericForm
        :finish-label="$t('buttons.finish_signup')"
        :pages="pages"
        @submit="onSubmit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {ref, Ref} from 'vue';
import {QForm} from 'quasar';
import GenericForm from 'src/components/forms/GenericForm.vue'

const emit = defineEmits(['submit'])

const form_ref: Ref<QForm|null> = ref(null)

const account_fields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('documents.document_upload'),
    fields: account_fields,
  },
]

// Get copy of prop form
const _pages = pages ? pages as Record<string, unknown>[] : undefined
const form: Form = new Form(_pages)

/**
 * Validates and, if valid, submits the form with all entered values
 * @async
 */
async function onSubmit(){
  const is_valid = await form_ref.value?.validate()

  if(is_valid){
    emit('submit', form.values.value)
  }

}
</script>
