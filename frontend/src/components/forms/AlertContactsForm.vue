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
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject, ref} from 'vue';

const routerService: RouterService|undefined = inject('$routerService')
const selection = ref([])

const checkboxes = [
  {val: 'event', label: 'Event'},
  {val: 'alarm1', label: 'Alarm 1'},
  {val: 'alarm2', label: 'Alarm 2'},
  {val: 'sms', label: 'SMS limit'},
]

/**
 * Routes to new Contact Page
 * @async
 * @returns {void}
 */
async function newContact(): Promise<void>{
  //TODO: new contact page
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}

</script>
