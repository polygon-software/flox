<template>
  <div class="column" style="min-width: 50%;">
    <!-- Search input -->
    <q-input
      v-model="search"
      :label="$t('general.filter')"
      outlined
      type="search"
      dense
    >
      <template #append>
        <q-icon name="search"/>
      </template>
    </q-input>
    <q-table
      class="q-mt-lg"
      flat
      :rows="allUsers"
      :columns="columns"
      row-key="uuid"
      :filter="search"
      :rows-per-page-options="[10,20, 100]"
    >
      <template #body="props">
        <q-tr
          :props="props"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="username">
            {{ props.row.username }}
          </q-td>
          <q-td key="uuid">
            {{ props.row.uuid }}
          </q-td>
          <q-td key="email">
            {{ props.row.email }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {fetchAllUsers} from 'src/helpers/api-helpers';
import {User} from 'src/data/types/User';

const search = ref('')
const routerService: RouterService | undefined = inject('$routerService')

// ----- Data -----
const columns = [
  {name: 'username', label: i18n.global.t('projects.client'), field: 'username', sortable: true, align: 'center'},
  {name: 'id', label: i18n.global.t('projects.id'), field: 'uuid', sortable: true, align: 'center'},
  {name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: true, align: 'center'},
]

const allUsers: Ref<User[]> = ref([])


/**
 * Routes to the customer page of the clicked customer ‡row
 * @param {Record<string, unknown>} row - the custom row that was clicked
 * @returns {Promise<void>} - done
 */
async function onRowClick(row: Record<string, unknown>): Promise<void> {
  await routerService?.addToRoute(row.username as string)
}

fetchAllUsers().then(users => allUsers.value = users).catch(e => console.error(e))
</script>
