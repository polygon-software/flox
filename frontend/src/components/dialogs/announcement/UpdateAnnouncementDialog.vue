<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.application')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.update_announcement') }}
        </h5>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-input
            v-model="announcement.title"
            :label="$t('announcement.title')"
          />

          <q-input
            v-model="announcement.content"
            :label="$t('announcement.content')"
            type="textarea"
          />

          <q-select
            v-model="announcement.userRoles"
            :label="$t('announcement.user_roles')"
            :options="options"
            multiple
          />

          <q-toggle v-model="announcement.scheduled" :label="$t('announcement.scheduled')"/>

          <q-input v-model="date" :disable="!announcement.scheduled" filled mask="##.##.####" :label="$t('announcement.date')">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" mask="DD.MM.YYYY" >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('announcement.update')"
          color="positive"
          @click="onOk"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, Ref } from 'vue';
import {QDialog} from 'quasar';
import {Announcement} from 'src/data/types/Announcement';
import { formatDate, parseDate } from 'src/helpers/format-helpers';
import {ROLE} from '../../../../../shared/definitions/ENUM'
import { cloneDeep } from 'lodash';

const props = defineProps({
  originalAnnouncement: {
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

const date = computed({
  get: () => formatDate(announcement.value.date),
  set: (dateString) => {
    announcement.value.date = parseDate(dateString)
  },
})

const options = [ROLE.PLAYER, ROLE.PARTNER]

const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const announcement = ref(cloneDeep(props.originalAnnouncement))

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * On OK, emit event
 * @returns {void}
 */
function onOk(): void{
  emit('ok', announcement.value)
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
