<template>
  <div style="width: 1000px">
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.user_data') }}
    </h5>
    <div style="display: flex; flex-direction: row">
      <div style="width: 35%">
        <q-btn
          :label="$t('buttons.load_parameters')"
          outline
          class="text-grey"
          @click="loadParameters"
        />
        <p>{{ $t('edit_parameters.station_name') }}</p>
        <q-input v-model="stationName" outlined style="width: 250px"/>
        <p>{{ $t('edit_parameters.comment') }}</p>
        <q-input v-model="comment" outlined style="width: 250px"/>
      </div>
      <div style="width: 65%">
        <q-btn
          style="float: right"
          :label="$t('buttons.save')"
          outline
          class="text-grey"
          @click="updateParams"
        />
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
              <q-input v-model.number="trigX" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="trigY" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="trigZ" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model="stateTrigger" borderless/>
            </div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Alarm 1</div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala1X" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala1Y" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala1Z" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-toggle
                v-model="ala1Mode"
                :label="ala1Mode"
                :disable="!ala1Edit"
                color="grey"
                false-value="Disabled"
                true-value="Enabled"
              />
            </div>
          </div>
          <div class="row">
            <div class="col q-ma-sm">Alarm 2</div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala2X" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala2Y" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-input v-model.number="ala2Z" outlined/>
            </div>
            <div class="col q-ma-sm">
              <q-toggle
                v-model="ala2Mode"
                :label="ala2Mode"
                :disable="!ala2Edit"
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
import {ref, onMounted, defineProps, Ref} from 'vue';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import {DEVICE_PARAMS} from 'src/data/queries/DEVICE';
import {UPDATE_PARAMS} from 'src/data/mutations/DEVICE';
import LoadDialog from 'components/dialogs/LoadDialog.vue';
import {useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';

const $q = useQuasar()

const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})

const stationName = ref(props.stationId)

// TODO: remove mock data and replace it with real ones
const stateTrigger = ref('Always active')

const trigX: Ref<number> = ref(0)
const trigY: Ref<number> = ref(0)
const trigZ: Ref<number> = ref(0)
const ala1X: Ref<number> = ref(0)
const ala1Y: Ref<number> = ref(0)
const ala1Z: Ref<number> = ref(0)
const ala2X: Ref<number> = ref(0)
const ala2Y: Ref<number> = ref(0)
const ala2Z: Ref<number> = ref(0)
const ala1Mode = ref('')
const ala2Mode = ref('')
const ala1Edit = ref(0)
const ala2Edit = ref(0)
const comment = ref('')
onMounted(async () => {
  const result = await executeQuery(DEVICE_PARAMS, {cli: props.stationId})
  const data = result.data.deviceParams as Record<string, string|number>
  trigX.value = data.trigX as number;
  trigY.value = data.trigY as number;
  trigZ.value = data.trigZ as number;
  ala1X.value = data.ala1X as number;
  ala1Y.value = data.ala1Y as number;
  ala1Z.value = data.ala1Z as number;
  ala2X.value = data.ala2X as number;
  ala2Y.value = data.ala2Y as number;
  ala2Z.value = data.ala2Z as number;
  ala1Edit.value = data.ala1_edit as number;
  ala2Edit.value = data.ala2_edit as number;
  comment.value = data.comment as string;
  if (data.ala1_mode) {
    ala1Mode.value = 'Enabled'
  }
  if (!data.ala1_mode) {
    ala1Mode.value = 'Disabled'
  }
  if (data.ala2_mode) {
    ala2Mode.value = 'Enabled'
  }
  if (!data.ala2_mode) {
    ala2Mode.value = 'Disabled'
  }
});

/**
 * Routes to Load Dialog
 * @returns {void}
 */
function loadParameters() {
  //TODO: onOK
  $q.dialog({
    component: LoadDialog,
    componentProps: {
      title: i18n.global.t('buttons.load_parameters'),
      text: i18n.global.t('edit_parameters.parameters_from_another')
    }
  })
}

/**
 * Updates the input parameters of that device pool which are changed
 * @returns {void}
 */
async function updateParams() {
  const writeAla1Mode = ala1Mode.value === 'Enabled'
  const writeAla2Mode = ala2Mode.value === 'Enabled'
  await executeMutation(UPDATE_PARAMS, {updateDeviceParamsInput: {cli: props.stationId,
      trigX: trigX.value,
      trigY: trigY.value,
      trigZ: trigZ.value,
      ala1X: ala1X.value,
      ala1Y: ala1Y.value,
      ala1Z: ala1Z.value,
      ala2X: ala2X.value,
      ala2Y: ala2Y.value,
      ala2Z: ala2Z.value,
      ala1_mode: writeAla1Mode,
      ala2_mode: writeAla2Mode,
      comment: comment.value }})
}

</script>

<style scoped>
  p{
    color: #87858A;
    margin-top: 25px;
    margin-bottom: 0
  }
</style>
