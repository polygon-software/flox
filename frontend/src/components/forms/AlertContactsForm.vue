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

const $q = useQuasar()

/**
 * Routes to new Contact Dialog
 * @returns {void}
 */
function newContact(){
  //TODO: onOk
  $q.dialog({
    component: AddContactDialog,
    componentProps: {}
  })
}

</script>
