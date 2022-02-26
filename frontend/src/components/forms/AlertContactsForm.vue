<template>
  <div>
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.contacts') }}
    </h5>
    <q-btn
      :label="$t('buttons.new_contact')"
      outline
      class="text-grey"
      @click="newContact"
    />

    <div style="display: flex;">
      <div style="display:flex; flex-direction: row">
        <div style="width: 250px">
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.name') }}</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">Marino Schneider</div>
            </template>
          </q-field>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.number') }}</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">+49 78 654 55 22</div>
            </template>
          </q-field>
        </div>
        <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; color: #87858A">
          <q-checkbox
            v-for="checkbox in checkboxes"
            :key="checkbox.val"
            v-model="selection"
            :val="checkbox.val"
            :label="checkbox.label"
          />
        </div>
      </div>

      <div style="display:flex; flex-direction: row; margin-left: 75px">
        <div style="width: 250px">
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.name') }}</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">Marino Schneider</div>
            </template>
          </q-field>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.number') }}</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">+49 78 654 55 22</div>
            </template>
          </q-field>
        </div>
        <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; color: #87858A">
          <q-checkbox
            v-for="checkbox in checkboxes"
            :key="checkbox.val"
            v-model="selection"
            :val="checkbox.val"
            :label="checkbox.label"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import AddContactDialog from 'src/components/dialogs/AddContactDialog.vue'
import {useQuasar} from 'quasar';

const selection = ref([])
const $q = useQuasar()

const checkboxes = [
  {val: 'event', label: 'Event'},
  {val: 'alarm1', label: 'Alarm 1'},
  {val: 'alarm2', label: 'Alarm 2'},
  {val: 'sms', label: 'SMS limit'},
]

/**
 * Routes to new Contact Dialog
 * @async
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
