<template>
  <h4>Payment Details</h4>
</template>

<script setup lang="ts">
import { inject, ref, Ref } from 'vue';

import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';
import { getPayment } from 'src/flox/modules/payment/services/payment.service';
import RouterService from 'src/services/RouterService';

const $routerService: RouterService | undefined = inject('$routerService');

const payment: Ref<PaymentEntity | null> = ref(null);

const uuid = $routerService?.getUrlParam('uuid');

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

<style scoped></style>
