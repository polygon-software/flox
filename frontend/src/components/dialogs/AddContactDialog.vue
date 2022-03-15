<template>
  <q-dialog
    ref="dialogRef"
    :no-backdrop-dismiss="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 250px">
      <h5 style="text-align: center">{{ $t('edit_parameters.add_new_contact') }}</h5>
      <q-form
          class="q-gutter-md full-width"
          @submit="onSubmit"
      >
        <GenericContactForm
          ref="contactForm"
          :cli="cli"
        />
        <q-card-actions align="center">
          <q-btn
            :label="$t('buttons.load')"
            outline
            class="text-grey"
            @click="onLoad"
          />
          <q-btn
            :label="$t('buttons.save')"
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
import GenericContactForm from 'components/forms/GenericContactForm.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
const contactForm = ref(null)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})

/**
 * On submit, it gets the form's data
 * @returns {void}
 */
function onSubmit(){
  if(contactForm.value){
    const form: typeof GenericContactForm = contactForm.value
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data: Record<string, unknown> = form.getData() as Record<string, unknown>
    onDialogOK(data)
  }
}

/**
 * On load, .....
 * @returns {void}
 */
function onLoad(){
  //TODO: open dialog for copying contact from another device
  onDialogCancel()
}

</script>
