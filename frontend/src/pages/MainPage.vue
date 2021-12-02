<template>
  <q-page class="flex flex-center">
    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <div class="column">
      <div class="row q-pa-md">
        <SampleTable/>
        <SampleForm/>
      </div>

      <div class="q-pa-md">
        <SampleSubscriptionTable/>
      </div>
    </div>

    <q-card>
      <q-btn
        color="purple"
        label="Send Test E-Mail"
        @click="sendTestEmail"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import SampleTable from 'components/SampleTable.vue'
import SampleForm from 'components/SampleForm.vue'
import SampleSubscriptionTable from 'components/SampleSubscriptionTable.vue'
import {sendEmail} from 'src/helpers/email-helpers';


async function sendTestEmail(): Promise<void>{
  await sendEmail(
    'david.wyss@polygon-solutions.ch',
    'david.wyss@polygon-solutions.ch',
    'Test E-mail',
    'Test body',
  )
}

</script>
