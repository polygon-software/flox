<template>
  <q-dialog
      ref="dialogRef"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 250px">
      <h5 style="text-align: center">{{ props.title }}</h5>
      <q-form
          class="q-gutter-md"
          @submit="onSubmit"
      >
        <LoadForm
          ref="contactForm"
          :text="props.text"
        />
        <q-card-actions align="center">
          <q-btn
            :label="$t('buttons.load')"
            outline
            class="text-grey"
            type="submit"
          />
          <q-btn
            :label="$t('buttons.cancel')"
            outline
            class="text-grey"
            @click="onDialogCancel"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import { useDialogPluginComponent } from 'quasar';
import LoadForm from 'components/forms/LoadForm.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
const contactForm = ref(null)

const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  }
})
/**
 * On submit, it gets the form's data
 * @returns {void}
 */
function onSubmit(){
  if(contactForm.value){
    const form: typeof LoadForm = contactForm.value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data: Record<string, unknown> = form.getData() as Record<string, unknown>
    onDialogOK(data)
  }
}

</script>
