<template>
  <div>
    <h5 class="column items-center justify-start full-width" style="margin-bottom: 30px;">
      {{ $t('edit_parameters.user_data') }}
    </h5>
    <div style="display: flex; flex-direction: row">
      <div style="width: 250px">
        <q-btn
          :label="$t('buttons.load_parameters')"
          outline
          class="text-grey"
          @click="loadParameters"
        />
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
        <q-table
          class="q-mt-lg"
          :rows="rows"
          :columns="columns"
          row-key="uuid"
          hide-bottom
          flat
          dense
          :table-style="{ color: 'grey' }"
          separator="none"
        >
          <template #body="props">
            <q-tr
              :props="props"
            >
              <q-td key="column">
                {{ props.row.column }}
              </q-td>
              <q-td key="channel_x">
                <q-field outlined stack-label>
                  <template #control>
                    <div class="self-center no-outline" tabindex="0">{{ props.row.channel_x }}</div>
                  </template>
                </q-field>
              </q-td>
              <q-td key="channel_y">
                <q-field outlined stack-label>
                  <template #control>
                    <div class="self-center no-outline" tabindex="0">{{ props.row.channel_y }}</div>
                  </template>
                </q-field>
              </q-td>
              <q-td key="channel_z">
                <q-field outlined stack-label>
                  <template #control>
                    <div class="self-center no-outline" tabindex="0">{{ props.row.channel_z }}</div>
                  </template>
                </q-field>
              </q-td>
              <q-td key="state">
                <div v-if="props.row.column === 'Trigger'">
                  Always Active
                </div>
                <q-toggle
                  v-else
                  v-model="props.row.state"
                  :label="props.row.state"
                  color="grey"
                  false-value="Disabled"
                  true-value="Enabled"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject, reactive} from 'vue';

const routerService: RouterService|undefined = inject('$routerService')

const columns = [
  { name: 'column', label: '', field: 'column', sortable: false, align: 'center' },
  { name: 'channel_x', label: 'Channel X', field: 'channel_x', sortable: false, align: 'center' },
  { name: 'channel_y', label: 'Channel Y', field: 'channel_y', sortable: false, align: 'center' },
  { name: 'channel_z', label: 'Channel Z', field: 'channel_z', sortable: false, align: 'center' },
  { name: 'state', label: 'State', field: 'state', sortable: false, align: 'center' },
]

const rows = reactive([
  {
    column: 'Trigger',
    channel_x: '0.250',
    channel_y: '0.350',
    channel_z: '0.500',
    state: 'Enabled',
  },
  {
    column: 'Alarm 1',
    channel_x: '0.150',
    channel_y: '0.300',
    channel_z: '0.550',
    state: 'Enabled',
  },
  {
    column: 'Alarm 2',
    channel_x: '0.110',
    channel_y: '0.310',
    channel_z: '0.700',
    state: 'Enabled',
  },
])

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
