<template>
  <q-dialog
    ref="dialog"
    :title="$t('employee_dashboard.all_documents')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <p>
          {{ $t('employee_dashboard.all_documents') }}
        </p>
        <div>
          <q-file
            v-model="files"
            class="q-mb-md"
            outlined
            accept="image/*, .pdf"
            :label="$t('employee_dashboard.upload_more_documents')"
            stack-label
            clearable
            use-chips
            multiple
            append
            @update:model-value="upload"
          />
        </div>
      </q-card-section>
      <q-card-actions>
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
import {ref, Ref} from "vue";
import {QDialog} from "quasar";

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const files = ref([])

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

//todo: implement upload which uploads the selected file and shows it
function upload(): void {
  show()
}


function onCancel(): void {
  hide()
}

</script>
