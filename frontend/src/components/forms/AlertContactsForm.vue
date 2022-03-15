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
    <!-- TODO: Replace mock data -->
    <div style="display: flex;">
      <GenericContactForm
        style="width: 50%;"
        full-name="Marino Schneider"
        phone-number="+49 78 563 66 22"
        email-address="marino.schneider@polygon-software.ch"
        :disabled="true"
      />
      <GenericContactForm
        style="width: 50%;"
        full-name="Marino Schneider"
        phone-number="+49 78 563 66 22"
        email-address="marino.schneider@polygon-software.ch"
        :disabled="true"
      />
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

const $q = useQuasar()

/**
 * Routes to new Contact Dialog
 * @async
 * @returns {void}
 */
function newContact(){
  $q.dialog({
    component: AddContactDialog,
    componentProps: {}
  }).onOk(async (formValues: Record<string, string|string[]>) => {
    // On dialog OK, create contact

    // Prepare mutation parameters
    const params = {
      cli: '39-11', // TODO this should probably be a prop passed downwards
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
      i18n.global.t('messages.project_deleted'),
      'bottom',
      'positive',
    )
  })
}

</script>
