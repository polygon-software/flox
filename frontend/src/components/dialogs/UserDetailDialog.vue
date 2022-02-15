<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card v-if="player" class="q-dialog-plugin q-pa-md" style="width: 800px;">
      <q-card-section>
        <!-- Documents -->
        <q-carousel
          v-model="currentDocumentKey"
          navigation
          arrows
          style="height: 250px;"
          control-color="black"
        >
          <q-carousel-slide
            v-for="document in documents"
            :key="document.key"
            :name="document.key"
            :img-src="document.url"
            style="background-size: contain; background-repeat: no-repeat;"
          />
        </q-carousel>
      </q-card-section>

      <q-card-section>
        <user-details :user="player"/>
      </q-card-section>

      <q-card-actions align="between">
        <!-- 'Disable' button for active accounts -->
        <q-btn
          v-if="player.status === USER_STATUS.ACTIVE"
          :label="$t('admin.disable_account')"
          icon="block"
          color="negative"
          @click="disableUser"
        />

        <!-- 'Enable'/'Re-enable' button for inactive accounts -->
        <q-btn
          v-else
          :label="$t(
                    player.status === USER_STATUS.DISABLED ?
                    'admin.re_enable_account'
                    :
                    'admin.enable_account'
                    )"
          icon="lock_open"
          color="positive"
          @click="enableUser"
        />

        <!-- Back -->
        <q-btn
          :label="$t('buttons.back')"
          color="black"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, defineProps, watch, computed, ComputedRef, defineEmits } from 'vue';
import { QDialog, useDialogPluginComponent, useQuasar } from 'quasar';
import { fetchPlayer } from 'src/helpers/api-helpers';
import { PRIVATE_FILE } from 'src/data/queries/FILE';
import { executeQuery } from 'src/helpers/data-helpers';
import { USER_STATUS } from '../../../../shared/definitions/ENUM';
import UserDetails from 'components/user/UserDetails.vue';
import { DialogService } from 'src/services/DialogService';

const quasar = useQuasar();
const dialogService: DialogService = new DialogService(quasar)

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  playerId: {
      required: true,
      type: String,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const player = fetchPlayer(props.playerId)

// General
const documents: Ref<Record<string, string>[]> = ref([]);
const playerDocuments: ComputedRef<Record<string, string>[]> = computed(() => player.value?.documents ?? [])
const currentDocumentKey: Ref<string> = ref( '')

/**
 * Open enableUser dialog
 * @returns {void} - void
 */
function enableUser(){
  if(player.value !== null) {
    dialogService?.enableUser(player.value)
  }
}

/**
 * Open disableUser dialog
 * @returns {void} - void
 */
function disableUser(){
  if(player.value !== null) {
    dialogService?.disableUser(player.value)
  }
}

/**
 * Fetch player documents (ID pictures) once.
 */
const stop = watch(playerDocuments, async () => {
  if(playerDocuments.value.length > 0) {
    documents.value = await updateDocuments()
    currentDocumentKey.value = documents.value[0]?.key ?? ''
    stop()
  }
})

/**
 * Fetch all documents
 * @returns {Promise<Record<string, string>[]>} - documents
 */
async function updateDocuments(): Promise<Record<string, string>[]>{
  return Promise.all(playerDocuments.value.map((document) => fetchFile(document.uuid)))
}

/**
 * Fetches a file
 * @param {string} fileUuid - uuid of file
 * @returns {Promise<Record<string, string>>} - file
 */
async function fetchFile(fileUuid: string): Promise<Record<string, string>> {
  const query = PRIVATE_FILE
  const queryRes = await executeQuery(query, {uuid: fileUuid})
  return queryRes.data[query.cacheLocation] as Record<string, string>
}
</script>
