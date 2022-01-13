<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10, 20, 100]"
      :filter="search"
      flat
      bordered
    />
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';
import {ALL_ANNOUNCEMENTS} from 'src/data/queries/ANNOUNCEMENTS';
import {Announcement} from 'src/data/types/Announcement';

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
  { name: 'userRole', label: 'User Role', field: 'userRole', sortable: true, align: 'left' },
  { name: 'date', label: 'Date', field: (announcement: Announcement) => announcement.date ? formatDateTime(new Date(announcement.date)) : '-', sortable: true, align: 'left' },
]

const allAnnouncementsQueryResult = subscribeToQuery(ALL_ANNOUNCEMENTS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return allAnnouncementsQueryResult.value ?? []
})

</script>
