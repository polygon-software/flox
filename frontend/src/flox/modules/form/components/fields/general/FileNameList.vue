<template>
  <q-card-section>
    <q-list separator>
      <q-item
        v-for="(file, index) in files"
        :key="file"
        class="row justify-between flex-center"
      >
        <q-item-section class="col-auto">
          <q-item-label>
            {{ file }}
          </q-item-label>
        </q-item-section>

        <q-item-section top side>
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click="deleteFile(index)"
          >
            <q-tooltip>
              {{ $t('files.remove') }}
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<script setup lang="ts">
const props = defineProps<{
  files: string[];
}>();

const emit = defineEmits<{
  (e: 'removeFile', index: number): void;
}>();

/**
 * Deletes a file from the list
 * @param index
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
function deleteFile(index: number): void {
  // TODO: handle file deletion
}
</script>
