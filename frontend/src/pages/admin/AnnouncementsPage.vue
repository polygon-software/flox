<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title -->
    <h6 class="q-ma-md">{{ $t('dashboards.announcements') }}</h6>

    <!-- Body: Table with tabs etc. -->
    <div
      class="column full-height items-start q-pa-md full-width"
    >
      <div class="row justify-between full-width">
        <!-- Search bar -->
        <q-input
          v-model="search"
          dense
          rounded
          outlined
          type="search"
          class="col-auto q-mb-md"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          :label="$t('admin.create_announcement')"
          color="positive"
          class="col-auto q-mb-md"
          icon="create"
          dense
          rounded
          @click="() => createAnnouncement($q)"
        />

      </div>

      <!-- Table view of products -->
      <AnnouncementsTable
        :search="search"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import AnnouncementsTable from 'components/table/AnnouncementsTable.vue';
import {ref} from 'vue';
import {createAnnouncement} from 'src/helpers/admin-helpers';

// Search term
const search = ref('')

</script>
