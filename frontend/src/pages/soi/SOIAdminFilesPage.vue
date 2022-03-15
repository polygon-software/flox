<template>
  <q-page class="flex flex-start">
    <div
      class="q-pa-lg full-width column justify-start"
    >
      <!-- Value increase CSV upload -->
      <q-card
        flat
        class="row justify-between q-pa-md"
        style="width: 900px"
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

      <!-- Get Logs -->
      <q-card
        flat
        class="row justify-between q-pa-md q-mt-lg"
        style="width: 900px"
      >
        <div class="col-6">
          <h6 class="q-ma-none">{{ $t('dashboards.logs') }}</h6>
          <q-item-label caption>
            {{ $t('dashboards.logs_description')}}
          </q-item-label>
        </div>
        <div class="col column">
          <q-input v-model="rangeDisplay" style="width: 250px" outlined @focusout="setRange"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="range"
                    range
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            :label="$t('buttons.download')"
            icon="download"
            color="primary"
            style="width: 250px"
            class="q-mt-md"
            @click="getLogs"/>
        </div>
        <div class="col column items-end">
          <q-btn
            v-for="log in links"
            :key="log.dateString"
            :label="formatDate(log.dateString)"
            @click="()=> {
              openURL(log.url)
            }"/>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ValueIncreaseUploadField from 'components/forms/fields/admin_file_upload/ValueIncreaseUploadField.vue';
import { ref, Ref, watch} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {openURL, useQuasar} from 'quasar';
import {uploadFiles} from 'src/helpers/file-helpers';
import {showNotification} from 'src/helpers/notification-helpers';
import {dateToInputString} from 'src/helpers/date-helpers';
import {executeQuery} from 'src/helpers/data-helpers';
import {LOG_FILES} from 'src/data/queries/FILE';
import {formatDate} from 'src/helpers/format-helpers'
import {parse} from 'date-fns';

const $q = useQuasar()

const file: Ref<null|File> = ref(null)
const start = new Date()
const to = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
const range: Ref<Record<string, string>|string> = ref({from: dateToInputString(start), to:dateToInputString(to)})
const rangeDisplay = ref(`${(range.value as Record<string, string>).from} - ${(range.value as Record<string, string>).to}`)
const links: Ref<Record<string, string>[]>  = ref([])
watch(() => range.value, () => {
  if(typeof range.value === 'string'){
    rangeDisplay.value = `${range.value} - ${range.value}`;
  } else {
    rangeDisplay.value = `${(range.value).from} - ${(range.value).to}`
  }
})

/**
 * Keeps range and rangeDisplay in sync
 * @return {void}
 */
function setRange(){
  const val = rangeDisplay.value
  const startDateString = val.substr(0, 10)
  const endDateString = val.substr(13)
  range.value = {}
  range.value.from = startDateString
  range.value.to = endDateString
}
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

/**
 * Fetch logs in specified date Range
 * @returns {Promise<void>} - done
 */
async function getLogs() {
  let fromDate: Date
  let toDate: Date
  const dateFormat = 'dd.MM.yyyy'
  if(typeof range.value === 'object'){
    fromDate =  parse(range.value.from, dateFormat, new Date())
    toDate = parse(range.value.to, dateFormat, new Date())
  } else {
    fromDate = parse(range.value, dateFormat, new Date())
    toDate = fromDate
  }

  const res = await executeQuery(LOG_FILES, {start: fromDate, end: toDate})
  const files = res.data[LOG_FILES.cacheLocation] as Array<Record<string, string>>
  links.value = []
  if(files.length === 1){
    openURL(files[0].url)
  } else {

    links.value = files.map((file)=>{
      return {
        dateString: file.last_modified_at,
        url: file.url
      }
    })
  }
}

</script>
