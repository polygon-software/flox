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
            <div class="self-center full-width no-outline" tabindex="0">Nord-1 B</div>
          </template>
        </q-field>
        <p>{{ $t('edit_parameters.station_name') }}</p>
        <q-field outlined stack-label style="width: 250px">
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">USZ01</div>
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
              <q-input v-model="channelxTrigger" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelyTrigger" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelzTrigger" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="stateTrigger" borderless/>
            </div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Alarm 1</div>
            <div class="col q-ma-sm">
              <q-input v-model="channelxAlarm1" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelyAlarm1" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelzAlarm1" outlined/>
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
              <q-input v-model="channelxAlarm2" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelyAlarm2" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="channelzAlarm2" outlined/>
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
import {inject, ref, onMounted} from 'vue';
import {executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_PARAMS} from 'src/data/queries/DEVICE';

const routerService: RouterService|undefined = inject('$routerService')

// const trigX = ref('')
// const trigY = ref('')
// const trigZ = ref('')
// const ala1X = ref('')
// const ala1Y = ref('')
// const ala1Z = ref('')
// const ala2X = ref('')
// const ala2Y = ref('')
// const ala2Z = ref('')
onMounted(async () => {
  const result = await executeQuery(DEVICE_PARAMS) as unknown as Record<string, Record<string, unknown>>;
  console.log('result', result)
  // trigX.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).trigX;
  // trigY.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).trigY;
  // trigZ.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).trigZ;
  // ala1X.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala1X;
  // ala1Y.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala1Y;
  // ala1Z.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala1Z;
  // ala2X.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala2X;
  // ala2Y.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala2Y;
  // ala2Z.value = (result?.getDeviceParams?.deviceParams as Record<string, string>).ala2Z;
});

// TODO: remove mock data and replace it with real ones
const channelxTrigger = ref('0.250')
const channelyTrigger = ref('0.350')
const channelzTrigger = ref('0.500')
const stateTrigger = ref('Always active')
const channelxAlarm1 = ref('0.150')
const channelyAlarm1 = ref('0.300')
const channelzAlarm1 = ref('0.550')
const stateAlarm1 = ref('Enabled')
const channelxAlarm2 = ref('0.150')
const channelyAlarm2 = ref('0.300')
const channelzAlarm2 = ref('0.550')
const stateAlarm2 = ref('Enabled')

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
