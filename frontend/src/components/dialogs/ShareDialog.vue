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
      <q-card-section class="column items-center">
          <!-- Title -->
          <h6 class="q-ma-none q-pa-none">
            {{$t('dashboard.share')}}
          </h6>

        <!-- E-Mail input -->
        <q-select
          v-model="targetAddresses"
          :label="$t('account_data.email')"
          new-value-mode="add"
          class="q-ma-md"
          outlined
          multiple
          use-chips
          use-input
          stack-label
          dense
          hide-dropdown-icon
        />

      </q-card-section>

      <q-card-section class="column items-center">
        <!-- Create Link button -->
        <q-btn
          :label="generatedLink ? generatedLink : $t('buttons.create_link')"
          :icon="generatedLink ? 'content_copy' : undefined"
          style="border-radius: 0;"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="generatedLink ? copyLink() : createLink()"
        />

      </q-card-section>
      <q-card-actions
        align="center"
      >
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
        style="border-radius: 0; margin-left: 30px"
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
import {defineProps, defineEmits, PropType, Ref, ref} from 'vue';
import { useDialogPluginComponent } from 'quasar';
import {showNotification} from 'src/helpers/notification-helpers';
import {QVueGlobals} from 'quasar';
import {i18n} from 'boot/i18n';

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const props = defineProps({
  q: {
    type: Object as PropType<QVueGlobals>,
    required: true
  }
})

// Addresses to send to (defaults to those given to dossier as prop)
const targetAddresses = ref([])

// Generated link
const generatedLink: Ref<string|null> = ref(null)

/**
 * Creates a link to the current graph and copies it to clipboard
 * @returns {Promise<void>} - done
 */
async function createLink(){
  // TODO create link
  console.log('CREATE link')
  generatedLink.value = 'https://www.datavis-sample.com/123'

  await copyLink()
}

/**
 * Copies the link to the clipboard
 * @returns {Promise<void>} - done
 */
async function copyLink(){
  if(generatedLink.value){
    await navigator.clipboard.writeText(generatedLink.value)
  }

  // Show success notification
  showNotification(
    props.q,
    i18n.global.t('messages.copied'),
    'center',
    'primary',
    undefined,
    undefined,
    undefined,
    500
  )
}

</script>
