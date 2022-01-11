<template>
  <div
    class="row full-width"
    style="margin: 20px 0 20px 0"
  >
    <!-- Label & caption -->
    <div class="column col-4">
      <q-item-label>
        {{ label }}{{ required ? ' *' : ''}}
      </q-item-label>
      <q-item-label v-if="caption" caption>
        {{ caption }}
      </q-item-label>
    </div>

    <!-- Uploaded files -->
    <div class="column col-6">
      <div
        v-for="(file, fileIndex) in files"
        :key="'file_' + fileIndex"
        class="row items-center"
      >
        <q-icon
          name="description"
          color="primary"
        />
        <!-- TODO link to file, proper centering -->
        <p class="text-primary" style="margin-left: 6px">
          {{file.filename}}
        </p>

        <!-- TODO:  @click="() => removeFile(section, field, file)" -->
        <q-btn
          class="q-pa-sm q-ma-none"
          icon="close"
          flat
          size="sm"
          color="grey-5"
        />
      </div>
    </div>

    <!-- Upload button -->
    <div style="width: 190px; height: 30px">
      <q-btn
        size="md"
        :label="$t('buttons.upload')"
        icon-right="upload"
        outline
        color="primary"
        @click="onUpload"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
 const props = defineProps({
   files: {
     type: Array,
     required: true
   },
   label: {
     type: String,
     required: true
   },
   caption:  {
     type: String,
     required: false,
     default: null
   },
   required: {
     type: Boolean,
     required: false,
     default: false
   }
 })

const emit = defineEmits(['upload'])

/**
 * Emits an 'upload' event
 * @returns {void}
 */
function onUpload(){
   emit('upload')
}

</script>
