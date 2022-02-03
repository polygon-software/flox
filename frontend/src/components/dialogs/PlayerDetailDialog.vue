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
          animated
          navigation
          infinite
          arrows
        >
          <q-carousel-slide
            v-for="document in documents"
            :key="document.key"
            :name="document.key"
            :img-src="document.url"
          />
        </q-carousel>

        <!-- Player info -->
        <div class="col">
          <h4 class="q-ml-sm">{{ player.username }}</h4>
          <h5 class="q-ml-sm">{{ player.fullName }}</h5>
          <h5 class="q-ml-sm">{{ player.address.prettyString()}}</h5>
        </div>

      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          :label="$t('buttons.back')"
          color="black"
          flat
          @click="hide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, defineProps, watch, computed, ComputedRef } from 'vue';
import {QDialog} from 'quasar';
import { fetchPlayer } from 'src/helpers/api-helpers';
import { PRIVATE_FILE } from 'src/data/queries/FILE';
import { executeQuery } from 'src/helpers/data-helpers';

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
    console.log(`${currentDocumentKey.value}`, documents.value)
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
