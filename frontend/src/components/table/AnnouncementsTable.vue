<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10, 20, 100]"
      :filter="search"
      flat bordered
      wrap-cells
      :pagination="pagination"
    >
      <template #body-cell-options="_props">
        <q-td key="options" :props="_props">
          <q-btn-dropdown
            dropdown-icon="more_vert"
            auto-close
            no-icon-animation
            flat
            round
            dense
          >
            <div class="column">
              <!-- update announcement -->
              <q-btn
                :label="$t('admin.update_announcement')"
                icon="edit"
                class="text-black"
                flat
                no-caps
                @click="() => updateAnnouncement(_props.row, $q)"
              />

              <!-- delete announcement -->
              <q-btn
                :label="$t('admin.delete_announcement')"
                icon="delete"
                class="text-black"
                flat
                no-caps
                @click="() => deleteAnnouncement(_props.row, $q)"
              />

            </div>
          </q-btn-dropdown>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {ALL_ANNOUNCEMENTS} from 'src/data/queries/ANNOUNCEMENTS';
import {updateAnnouncement, deleteAnnouncement} from 'src/helpers/admin-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
})

// TODO i18n
const columns = [
  { name: 'title', label: 'Title', field: 'title', sortable: true, align: 'left' },
  { name: 'content', label: 'Content', field: 'content', sortable: true, align: 'left' },
  { name: 'userRoles', label: 'User Roles', field: 'userRoles', sortable: true, align: 'left', format: (val:string[]) => val.join(', ') },
  { name: 'date', label: 'Date', field: 'date', sortable: true, align: 'left', format: (val:string) => formatDate(new Date(val)) },
  { name: 'options', label: '', field: 'options', sortable: false, align: 'left'},

]

const allAnnouncementsQueryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<Record<string, unknown>[]>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return allAnnouncementsQueryResult?.value ?? [];
})

const pagination = ref({
  sortBy: 'date',
  descending: true,
})

</script>
