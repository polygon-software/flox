<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5 class="q-ma-none q-pa-none">
          {{ $t('admin.create_announcement') }}
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
            use-chips
            stack-label
            multiple
            :options="options"
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
          :label="$t('announcement.create')"
          color="positive"
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
import { computed, defineEmits, ref, Ref } from 'vue'
import { QDialog, useDialogPluginComponent } from 'quasar';
import { Announcement } from 'src/data/types/Announcement';
import { ROLE } from '../../../../../shared/definitions/ENUM'
import { formatDate, parseDate } from 'src/helpers/format-helpers';

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const announcement: Ref<Announcement> = ref(new Announcement('', new Date(), '', [ROLE.PLAYER], false))

const date = computed({
  get: () => formatDate(announcement.value.date),
  set: (dateString: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    announcement.value.date = parseDate(dateString)
  },
})

const options = [ROLE.PLAYER, ROLE.PARTNER]

/**
 * On OK, emit event
 * @returns {void}
 */
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK(announcement.value)
}

</script>
