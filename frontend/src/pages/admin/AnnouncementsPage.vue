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
          @click="createAnnouncement"
        />

      </div>
      <div class="row full-width">
        <div class="col-auto">
          <div class="q-px-sm">
            {{ $t('announcement.role_filter') }}:
          </div>
          <div class="q-gutter-sm">
            <q-radio v-model="roleFilter" :val="null" :label="$t('admin.all')" />
            <q-radio v-model="roleFilter" :val="ROLE.PLAYER" :label="ROLE.PLAYER" />
            <q-radio v-model="roleFilter" :val="ROLE.PARTNER" :label="ROLE.PARTNER" />
          </div>
        </div>
        <div class="col-1" />
        <div class="col-auto">
          <div class="q-px-sm">
            {{ $t('announcement.date_filter') }}:
          </div>
          <div class="q-gutter-sm">
            <q-radio v-model="dateFilter" :val="null" :label="$t('admin.all')" />
            <q-radio v-model="dateFilter" val="past" :label="$t('announcement.past')" />
            <q-radio v-model="dateFilter" val="future" :label="$t('announcement.future')" />
          </div>
        </div>
      </div>

      <!-- Table view of products -->
      <AnnouncementsTable
        :search="search"
        :role-filter="roleFilter"
        :date-filter="dateFilter"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import AnnouncementsTable from 'components/table/AnnouncementsTable.vue';
import { inject, Ref, ref } from 'vue';
import {ROLE} from '../../../../shared/definitions/ENUM';
import { DialogService } from 'src/services/DialogService';

const dialogService: DialogService | undefined = inject('$dialogService')

const roleFilter: Ref<null|ROLE> = ref(null)
const dateFilter: Ref<null|string> = ref(null)

// Search term
const search = ref('')

/**
 * Open announcement creation dialog.
 * @returns {void} - void
 */
function createAnnouncement(){
  dialogService?.createAnnouncement();
}

</script>
