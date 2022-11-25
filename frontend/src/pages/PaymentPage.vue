<template>
  <div class="row justify-between items-center">
    <h4>{{ $t('payment.payment') }}</h4>
    <q-btn
      unelevated
      outline
      color="primary"
      :label="$t('payment.test_payment')"
      class="q-mr-sm"
      icon-right="account_balance_wallet"
      no-caps
      @click="initiateTestPayment"
    />
  </div>
  <PaymentForm
    v-if="isTestingPayment && payment && payment.secret && payment.amount && payment.currency"
    :uuid="payment.uuid"
    :secret="payment.secret"
    :amount="payment.amount"
    :currency="payment.currency"
    @success="isTestingPayment = false"
  />
  <div
    v-if="!payment && isTestingPayment"
    class="row full-width justify-center"
  >
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="primary"
      class="q-ma-md"
      :thickness="0.1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

import PaymentForm from 'src/flox/modules/payment/components/PaymentForm.vue';
import { createTestPayment } from 'src/flox/modules/payment/services/payment.service';
import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';

const payment: Ref<PaymentEntity | null> = ref(null);
const isTestingPayment: Ref<boolean> = ref(false);

/**
 * Initiates a new test payment
 */
async function initiateTestPayment(): Promise<void> {
  isTestingPayment.value = true;
  const testPayment = await createTestPayment();
  payment.value = testPayment;
}
</script>
