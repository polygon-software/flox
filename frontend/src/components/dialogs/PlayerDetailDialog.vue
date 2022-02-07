<template>
  <q-dialog
    ref="dialog"
    title="DetailView"
    @hide="hide"
  >
    <q-card v-if="player" class="q-pa-md" style="width: 800px;">
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
          @click="() => disableUser(player, $q)"
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
          @click="() => enableUser(player, $q)"
        />

        <!-- Back -->
        <q-btn
          :label="$t('buttons.back')"
          color="black"
          @click="hide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, defineProps, watch, computed, ComputedRef } from 'vue';
import { QDialog } from 'quasar';
import { fetchPlayer } from 'src/helpers/api-helpers';
import { PRIVATE_FILE } from 'src/data/queries/FILE';
import { executeQuery } from 'src/helpers/data-helpers';
import { enableUser, disableUser } from 'src/helpers/admin-helpers';
import { USER_STATUS } from '../../../../shared/definitions/ENUM';
import UserDetails from 'components/user/UserDetails.vue';


const dialog: Ref<QDialog|null> = ref(null)
// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  //eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

const props = defineProps({
  playerId: {
      required: true,
      type: String,
  }
})

const player = fetchPlayer(props.playerId)

// General
const documents: Ref<Record<string, string>[]> = ref([]);
const playerDocuments: ComputedRef<Record<string, string>[]> = computed(() => player.value?.documents ?? [])
const currentDocumentKey: Ref<string> = ref( '')

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
