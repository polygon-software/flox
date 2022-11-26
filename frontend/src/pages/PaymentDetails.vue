<template>
  <h4>
    Payment
    <PaymentStateBadge :status="payment?.status" />
  </h4>
  <q-table
    style="max-width: 400px"
    flat
    dense
    bordered
    hide-header
    hide-bottom
    hide-pagination
    :rows="rows"
    row-key="name"
    separator="none"
  >
  </q-table>
</template>

<script setup lang="ts">
import { computed, ComputedRef, inject, ref, Ref } from 'vue';
import { format } from 'date-fns';

import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';
import { getPayment } from 'src/flox/modules/payment/services/payment.service';
import RouterService from 'src/services/RouterService';
import { formatCurrency } from 'src/format/currency.format';
import PaymentStateBadge from 'src/flox/modules/payment/components/PaymentStateBadge.vue';

const $routerService: RouterService | undefined = inject('$routerService');

const payment: Ref<PaymentEntity | null> = ref(null);

const uuid = $routerService?.getUrlParam('uuid');

const amountStr: ComputedRef<string> = computed(() => {
  if (!payment.value) {
    return '';
  }
  return formatCurrency(payment.value?.amount, payment.value?.currency);
});

const rows: ComputedRef<Record<string, any>[]> = computed(() => {
  const created = new Date(payment.value?.createdAt ?? 0);
  return [
    { name: 'Date', value: format(created, 'dd.MM.yyyy') },
    { name: 'Amount', value: amountStr.value },
    { name: 'Currency', value: payment.value?.currency?.toUpperCase() },
    { name: 'Description', value: payment.value?.description },
    { name: 'E-Mail', value: payment.value?.buyer?.email },
  ].filter((r) => r.value);
});

if (uuid) {
  getPayment(uuid)
    .then((data) => {
      payment.value = data;
    })
    .catch((e) => {
      console.error(e);
    });
}
</script>
