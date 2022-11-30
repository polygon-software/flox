<template>
  <div v-if="!stripeLoaded" class="row full-width justify-center">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="primary"
      class="q-ma-md"
      :thickness="0.1"
    />
  </div>
  <form id="payment-form" @submit.prevent.stop="handleSubmit">
    <div id="payment-element" class="q-mb-lg">
      <!--Stripe.js injects the Payment Element-->
    </div>
    <q-btn
      type="submit"
      :label="$t('payment.pay_amount', { amount: amountStr })"
      color="primary"
      :loading="isSending"
    />
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';
import { getCssVar, useQuasar } from 'quasar';
import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js/types/stripe-js/elements';

import env from 'src/env';
import { showErrorNotification } from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';
import { formatCurrency } from 'src/format/currency.format';

import type { Appearance, Stripe } from '@stripe/stripe-js';
import type { StripeElements } from '@stripe/stripe-js/types/stripe-js/elements-group';

const props = defineProps<{
  uuid: string;
  secret: string;
  amount: number;
  currency: string;
  redirectUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'error'): void;
}>();

const stripeLoaded: Ref<boolean> = ref(true);
const isSending: Ref<boolean> = ref(false);

const amountStr = computed(() => {
  return formatCurrency(props.amount, props.currency);
});

const paymentElementOptions: StripePaymentElementOptions = {};
const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: getCssVar('primary') ?? undefined,
  },
};

const $q = useQuasar();

let stripe: Stripe | null;
let elements: StripeElements | null;

/**
 * Handles the payment submission
 */
async function handleSubmit(): Promise<void> {
  if (!stripe || !elements) {
    return;
  }
  isSending.value = true;
  const returnUrl =
    props.redirectUrl ??
    `${window.location.origin}${env.MODE === 'spa' ? '/#' : ''}/payment/${
      props.uuid
    }`;
  const confirmation = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // eslint-disable-next-line camelcase
      return_url: returnUrl,
    },
  });
  isSending.value = false;
  if (confirmation.error) {
    console.error(confirmation.error);
    showErrorNotification($q, i18n.global.t('payment.failed'));
    emit('error');
  }
}

onMounted(async () => {
  stripe = await loadStripe(env.STRIPE_PUBLIC_KEY);
  if (!stripe) {
    return;
  }
  elements = stripe.elements({ appearance, clientSecret: props.secret });

  const paymentElement = elements.create('payment', paymentElementOptions);
  paymentElement.mount('#payment-element');
  stripeLoaded.value = true;
});
</script>
