<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.application')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.create_announcement') }}
        </h5>
      </q-card-section>
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <q-input
                v-model="announcement.title"
                :label="$t('announcement.title')"

              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t('announcement.content') }}</q-item-label>
                <q-editor
                  v-model="announcement.content"
                />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-select
                v-model="announcement.userRole"
                :label="$t('announcement.user_role')"
                :options="options"
                map-options emit-value
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('announcement.create')"
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
import {defineEmits, ref, Ref} from 'vue'
import {QDialog} from 'quasar';
import {Announcement} from 'src/data/types/Announcement';
import {ROLE} from '../../../../shared/definitions/ENUM'

const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const announcement = ref(new Announcement(undefined, undefined, undefined, ROLE.PLAYER))

const options = Object.entries(ROLE).map(([key, value]) => {return {label: key, value: value}})

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
