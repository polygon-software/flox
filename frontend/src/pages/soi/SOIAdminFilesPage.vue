<template>
  <q-page class="flex flex-start">
    <div
      class="q-pa-lg full-width column justify-start"
    >
      <!-- Value increase CSV upload -->
      <q-card
        flat
        class="row justify-between q-pa-md"
        style="width: 670px"
      >
        <div class="col-6">
          <h6 class="q-ma-none">{{ $t('dashboards.value_increase_csv') }}</h6>
          <q-item-label caption>
            {{ $t('dashboards.value_increase_csv_description')}}
          </q-item-label>
        </div>
        <div class="col column items-end">
          <ValueIncreaseUploadField
            @change="(val) => file = val"
          />

          <q-btn
            :label="$t('buttons.upload')"
            icon="upload"
            color="primary"
            :disable="!file"
            style="width: 250px"
            @click="onCsvUpload"
          />
        </div>
      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import ValueIncreaseUploadField from 'components/forms/fields/admin_file_upload/ValueIncreaseUploadField.vue';
import {ref, Ref} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';
import {uploadFiles} from 'src/helpers/file-helpers';
import {showNotification} from 'src/helpers/notification-helpers';

const $q = useQuasar()

const file: Ref<null|File> = ref(null)


/**
 * When CSV is uploaded show warning dialog & upload on confirm
 * @returns {void}
 */
function onCsvUpload(){
  if(file.value){

    // Show warning dialog
    $q.dialog({
      component: WarningDialog,
      componentProps: {
        description: i18n.global.t('warnings.csv_file_warning'),
        okLabel: i18n.global.t('buttons.upload'),
        discardLabel: i18n.global.t('buttons.cancel'),
        showDiscard: true,
        swapNegative: true
      }
    }).onOk(() => {
      // Prepare file
      const files = {'value_development.csv': file.value}

      // Upload actual file
      uploadFiles(
        files,
        '/uploadValueDevelopmentFile'
      ).then(() => {
        // Show confirmation prompt
        showNotification(
          $q,
          i18n.global.t('messages.file_uploaded'),
          undefined,
          'positive'
        )
      }).catch(() => {
        // Show error message
        showNotification(
          $q,
          i18n.global.t('errors.file_upload_failed'),
          undefined,
          'negative'
        )
      })
    })
  }
}

</script>
