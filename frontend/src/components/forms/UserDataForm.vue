<template>
  <div>
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.user_data') }}
    </h5>
    <q-btn
      :label="$t('buttons.load_parameters')"
      outline
      class="text-grey"
      @click="loadParameters"
    />
    <div style="display: flex; flex-direction: row">
      <div>
        <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.project_name') }}</p>
        <q-field outlined stack-label>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">Nord-1 B</div>
          </template>
        </q-field>
        <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.station_name') }}</p>
        <q-field outlined stack-label>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">USZ01</div>
          </template>
        </q-field>
      </div>

      <div style="margin-left: 75px">
        <div style="display: flex; flex-direction: row">
          <p style="color: white; margin-top: 25px; margin-bottom: 0; margin-left: 15px">Nothing</p>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0; margin-left: 15px">Channel X</p>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0; margin-left: 15px">Channel Y</p>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0; margin-left: 15px">Channel Z</p>
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0; margin-left: 15px">State</p>
        </div>

        <div style="display: flex; flex-direction: row">
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">Trigger</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <p style="margin-top: 25px; margin-bottom: 0; margin-left: 15px">Always Active</p>
        </div>

        <div style="display: flex; flex-direction: row">
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">Alarm 1</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-toggle
            v-model="toggle1"
            :label="toggle1"
            color="grey"
            false-value="Disabled"
            true-value="Enabled"
          />
        </div>

        <div style="display: flex; flex-direction: row">
          <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">Alarm 2</p>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-field outlined stack-label>
            <template #control>
              <div class="self-center no-outline" tabindex="0">0.250</div>
            </template>
          </q-field>
          <q-toggle
            v-model="toggle2"
            :label="toggle2"
            color="grey"
            false-value="Disabled"
            true-value="Enabled"
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
const toggle1 = ref('Enabled')
const toggle2 = ref('Enabled')

/**
 * Loads the parameters of that device pool which is selected
 * @async
 * @returns {void}
 */
async function loadParameters(): Promise<void>{
  //TODO: loads the parameters
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}

</script>
