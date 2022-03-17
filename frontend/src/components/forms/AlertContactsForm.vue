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
    <q-btn
      :label="$t('buttons.load_contact')"
      outline
      class="text-grey"
      style="margin-left: 10px"
      @click="loadContact"
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
import LoadDialog from 'components/dialogs/LoadDialog.vue';
import {i18n} from 'boot/i18n';

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

/**
 * Routes to Load Dialog
 * @returns {void}
 */
function loadContact(){
  //TODO: onOk
  $q.dialog({
    component: LoadDialog,
    componentProps: {
      title: i18n.global.t('buttons.load_contact'),
      text: i18n.global.t('edit_parameters.contact_from_another')
    }
  })
}

</script>
