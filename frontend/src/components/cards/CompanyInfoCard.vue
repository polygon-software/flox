<template>
  <q-card
    v-if="company"
    class="full-width row justify-between q-pa-sm"
    style="margin-bottom: 20px; text-align: center"
    flat
  >
    <!-- Placeholder div for spacing -->
    <div/>

    <!-- Welcome title -->
    <div class="column">
      <q-item-label>
        {{ $t('general.welcome') }}, {{ company.first_name }} {{ company.last_name }}
      </q-item-label>
      <q-item-label caption>
        ID: {{ company.readable_id }}
      </q-item-label>
    </div>

    <!-- Terms and conditions -->
    <q-btn
      :label="$t('account_data.conditions')"
      text-color="primary"
      flat
      @click="showTermsAndConditionsDialog"
    />
  </q-card>
</template>

<script setup lang="ts">

import {subscribeToQuery} from 'src/helpers/data-helpers';
import {Ref} from 'vue';
import {MY_COMPANY} from 'src/data/queries/COMPANY';
import {useRoute} from 'vue-router';
import {useQuasar} from 'quasar';
import TermsAndConditionsDialog from 'components/dialogs/TermsAndConditionsDialog.vue';

const route = useRoute()
const $q = useQuasar()

// Company ID from route (if any), only relevant if going from SOIAdmin -> Company view
const companyUuid = route.query.cid

const company = subscribeToQuery(MY_COMPANY, companyUuid ? {companyUuid} : {}) as Ref<Record<string, Array<Record<string, unknown>>>>

/**
 * Shows a dialog with the terms & conditions PDF
 * @returns {void}
 */
function showTermsAndConditionsDialog(){
  $q.dialog({
    component: TermsAndConditionsDialog,
    componentProps: {}
  })
}

</script>
