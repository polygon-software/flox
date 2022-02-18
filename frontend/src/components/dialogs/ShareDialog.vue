<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 800px;"
      flat
      square
    >
      <q-card-section>
        <div class="column items-center">
          <!-- Title -->
          <h6 class="q-ma-none q-pa-none">
            {{$t('dashboard.share')}}
          </h6>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <!-- Create Link button -->
        <q-btn
          :label="$t('buttons.create_link')"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="createLink"
        />
      </q-card-actions>
      <q-card-actions align="center">
        <!-- Send button -->
        <q-btn
          :label="$t('buttons.send')"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="onDialogOK"
        />

        <!-- Cancel button -->
        <q-btn
        :label="$t('buttons.cancel')"
        style="border-radius: 0"
        text-color="primary"
        no-caps
        unelevated
        outline
        @click="onDialogCancel"
      />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { useDialogPluginComponent } from 'quasar';

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

/**
 * Creates a link to the current graph
 * @returns {void}
 */
function createLink(){
  // TODO create link
  console.log('CREATE link')
}

</script>
