<template>
  <div style="width: 1000px">
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.user_data') }}
    </h5>
    <div style="display: flex; flex-direction: row">
      <div style="width: 50%">
        <q-btn
          :label="$t('buttons.load_parameters')"
          outline
          class="text-grey"
          @click="loadParameters"
        />
        <p>{{ $t('edit_parameters.project_name') }}</p>
        <q-field outlined stack-label style="width: 250px">
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">{{ props.projectId }}</div>
          </template>
        </q-field>
        <p>{{ $t('edit_parameters.station_name') }}</p>
        <q-field outlined stack-label style="width: 250px">
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">{{ props.stationId }}</div>
          </template>
        </q-field>
      </div>
      <div style="width: 50%">
        <q-form style="display:flex; flex-direction: column">
          <div class="row">
            <div class="col q-ma-sm"></div>
            <div class="col q-ma-sm">Channel X</div>
            <div class="col q-ma-sm">Channel Y</div>
            <div class="col q-ma-sm">Channel Z</div>
            <div class="col q-ma-sm">State</div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Trigger</div>
            <div class="col q-ma-sm">
              <q-input v-model="trigX" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="trigY" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="trigZ" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="stateTrigger" borderless/>
            </div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Alarm 1</div>
            <div class="col q-ma-sm">
              <q-input v-model="ala1X" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="ala1Y" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="ala1Z" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-toggle
                v-model="stateAlarm1"
                :label="stateAlarm1"
                color="grey"
                false-value="Disabled"
                true-value="Enabled"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Alarm 2</div>
            <div class="col q-ma-sm">
              <q-input v-model="ala2X" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="ala2Y" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="ala2Z" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-toggle
                v-model="stateAlarm2"
                :label="stateAlarm2"
                color="grey"
                false-value="Disabled"
                true-value="Enabled"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject, ref, onMounted, defineProps} from 'vue';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_PARAMS} from 'src/data/queries/DEVICE';

const routerService: RouterService|undefined = inject('$routerService')

const props = defineProps({
  projectId: {
    required: true,
    type: String
  },
  stationId: {
    required: true,
    type: String
  }
})

// TODO: remove mock data and replace it with real ones
const stateTrigger = ref('Always active')
const stateAlarm1 = ref('Enabled')
const stateAlarm2 = ref('Enabled')

const trigX = ref()
const trigY = ref()
const trigZ = ref()
const ala1X = ref()
const ala1Y = ref()
const ala1Z = ref()
const ala2X = ref()
const ala2Y = ref()
const ala2Z = ref()
onMounted(async () => {
  const result = await executeQuery(DEVICE_PARAMS, {cli: props.stationId})
  const data = result.data.deviceParams as Record<string, string|number>
  trigX.value = data.trigX;
  trigY.value = data.trigY;
  trigZ.value = data.trigZ;
  ala1X.value = data.ala1X;
  ala1Y.value = data.ala1Y;
  ala1Z.value = data.ala1Z;
  ala2X.value = data.ala2X;
  ala2Y.value = data.ala2Y;
  ala2Z.value = data.ala2Z;
});

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

<style scoped>
  p{
    color: #87858A;
    margin-top: 25px;
    margin-bottom: 0
  }
</style>
