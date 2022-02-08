<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin" style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.delete_announcement') }}
        </h5>
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <q-item-label>{{ $t('announcement.title') }}</q-item-label>
              {{ announcement.title }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t('announcement.content') }}</q-item-label>
              {{ announcement.content }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t('announcement.user_role') }}</q-item-label>
              {{ announcement.userRole }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t('announcement.date') }}</q-item-label>
              {{ formatDate(announcement.date) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('announcement.delete')"
          color="negative"
          @click="onOKClick"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { QDialog, useDialogPluginComponent } from 'quasar';
import { Announcement } from 'src/data/types/Announcement';
import { formatDate } from 'src/helpers/format-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  announcement: {
    required: true,
    type: Announcement,
    uuid: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    userRole:{
      required: true,
      type: String,
    },
  }
})

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

/**
 * On OK, emit event
 * @returns {void}
 */
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK(props.announcement)
}

</script>
