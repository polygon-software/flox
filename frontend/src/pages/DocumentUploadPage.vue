<template>
  <q-page class="flex flex-center">
    <div class="column">
      <GenericForm
        v-if="companyId"
        :finish-label="$t('finish_signup')"
        :pages="pages"
        @submit="onSubmit"
      />
      <q-card
        v-else
        class="q-pa-md bg-red"
      >
        <h2>
          Error: Invalid link...
        </h2>
        <!-- TODO styling -->
      </q-card>
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
import {useRoute} from 'vue-router';

const emit = defineEmits(['submit'])

// Get base64-encoded UUID from URL params
const route = useRoute()
const companyId = route.query.cid

const form_ref: Ref<QForm|null> = ref(null)

const account_fields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('document_upload'),
    fields: account_fields,
  },
]

const form: Form = new Form(pages)

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
