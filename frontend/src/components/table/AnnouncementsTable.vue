<template>
  <div class="column full-width">
    <q-table
      :rows="filteredAnnouncements"
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
import { i18n } from 'boot/i18n';
import {ROLE} from '../../../../shared/definitions/ENUM';
import { Announcement } from 'src/data/types/Announcement';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
  roleFilter: {
    required: false,
    default: null,
    type: String,
  },
  dateFilter: {
    required: false,
    default: null,
    type: String,
  },
})

const columns = [
  { name: 'title', label: i18n.global.t('announcement.title'), field: 'title', sortable: true, align: 'left' },
  { name: 'content', label: i18n.global.t('announcement.content'), field: 'content', sortable: true, align: 'left' },
  { name: 'userRoles', label: i18n.global.t('announcement.user_roles'), field: 'userRoles', sortable: true, align: 'left', format: (val:string[]) => val.join(', ') },
  { name: 'date', label: i18n.global.t('announcement.date'), field: 'date', sortable: true, align: 'left', format: (val:string) => formatDate(new Date(val)) },
  { name: 'options', sortable: false, align: 'left', style: 'width: 0;'},
]

const allAnnouncementsQueryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<Record<string, unknown>[]>

const realAnnouncements = computed(() => {
  const announcementRecords = allAnnouncementsQueryResult?.value ?? [];
  return announcementRecords.map((record) => new Announcement(
    record.title as string,
    new Date(record.date as string),
    record.content as string,
    record.userRoles as ROLE[],
    record.scheduled as boolean,
    record.uuid as string,
  ))
})

const filteredAnnouncements = computed(() => {
  let announcements = realAnnouncements.value
  if(props.roleFilter !== null){
    announcements = announcements.filter((announcement) => announcement.userRoles.includes(props.roleFilter as ROLE))
  }
  if(props.dateFilter !== null){
    const now = Date.now()
    if(props.dateFilter === 'past'){
      announcements = announcements.filter((announcement) => announcement.date.getTime() < now)
    }
    else if(props.dateFilter === 'future'){
      announcements = announcements.filter((announcement) => announcement.date.getTime() > now)
    }
  }
  return announcements
})

const pagination = ref({
  sortBy: 'date',
  descending: true,
})

</script>
