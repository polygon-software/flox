<template>
  <div style="width: 1000px">
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.contacts') }}
    </h5>
    <q-btn
      :label="$t('buttons.new_contact')"
      outline
      class="text-grey"
      @click="newContact"
    />

    <div class="row">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        style="width: 50%"
      >
        <GenericContactForm
          :cli="cli"
          :contact="contact"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddContactDialog from 'src/components/dialogs/AddContactDialog.vue'
import {useQuasar} from 'quasar';
import GenericContactForm from 'components/forms/GenericContactForm.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {ADD_CONTACT_TO_DEVICE} from 'src/data/mutations/DEVICE';
import {showNotification} from 'src/helpers/notification-helpers';
import {i18n} from 'boot/i18n';
import {deviceContacts} from 'src/helpers/api-helpers';
import {defineProps} from 'vue';

const $q = useQuasar()

const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})

const contacts = deviceContacts(props.cli)

/**
 * Shows a dialog for creating new contacts
 * @returns {void}
 */
function newContact(){
  $q.dialog({
    component: AddContactDialog,
    componentProps: {
      cli: props.cli
    }
  }).onOk(async (formValues: Record<string, string|string[]>) => {
    // Prepare mutation parameters
    const params = {
      cli: props.cli,
      name: formValues.name,
      phone: formValues.phone.toString().replace(/\s/g, ''), // remove whitespace
      email: formValues.email,
      event: formValues.selection.includes('event'),
      alarm1: formValues.selection.includes('alarm1'),
      alarm2: formValues.selection.includes('alarm1'),
      smsLimit: formValues.selection.includes('smsLimit'),
      power: formValues.selection.includes('power'),
      memory: formValues.selection.includes('memory'),
      daily: formValues.selection.includes('daily'),
    }

    // Execute mutation
    try{
      await executeMutation(ADD_CONTACT_TO_DEVICE, params)
    } catch (e){
      // Show error notification
      showNotification(
        $q,
        i18n.global.t('errors.error_adding_contact'),
        'bottom',
        'negative',
      )
      return
    }

    // Show success notification
    showNotification(
      $q,
      i18n.global.t('messages.contact_added'),
      'bottom',
      'positive',
    )
  })
}

</script>
