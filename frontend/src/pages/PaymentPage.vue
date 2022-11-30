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
  <div class="q-mb-lg">
    <PaymentForm
      v-if="
        isTestingPayment &&
        payment &&
        payment.secret &&
        payment.amount &&
        payment.currency
      "
      :uuid="payment.uuid"
      :secret="payment.secret"
      :amount="payment.amount"
      :currency="payment.currency"
      @success="isTestingPayment = false"
    />
  </div>
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
  <DataTable
    :title="$t('payment.payments')"
    prepend-slot
    append-slot
    export-selection
    delete-selection
    multi
    :prepend-name="$t('payment.avatar')"
    :append-name="$t('payment.status')"
    :columns="columns"
    :query="SEARCH_PAYMENT"
  >
    <template #prepend="slotProps">
      <q-td :props="slotProps">
        <q-avatar size="26px">
          <img :src="avatarForUser(slotProps.row.buyer.uuid)" alt="avatar" />
        </q-avatar>
      </q-td>
    </template>
    <template #append="slotProps">
      <q-td :props="slotProps">
        <PaymentStateBadge :status="slotProps.row.status" />
      </q-td>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { format } from 'date-fns';

import PaymentForm from 'src/flox/modules/payment/components/PaymentForm.vue';
import { createTestPayment } from 'src/flox/modules/payment/services/payment.service';
import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';
import DataTable from 'components/tables/DataTable.vue';
import { SEARCH_PAYMENT } from 'src/flox/modules/payment/payment.query';
import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import { avatarForUser } from 'src/flox/modules/auth/services/user.service';
import { formatCurrency } from 'src/format/currency.format';
import PaymentStateBadge from 'src/flox/modules/payment/components/PaymentStatusBadge.vue';
import { i18n } from 'boot/i18n';

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

const columns: Ref<ColumnInterface<PaymentEntity>[]> = ref([
  {
    name: 'buyer.username',
    label: i18n.global.t('payment.buyer'),
    field: 'buyer.username',
    align: ColumnAlign.left,
    sortable: false,
    edit: false,
  },
  {
    name: 'description',
    label: i18n.global.t('payment.product'),
    field: 'description',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'date',
    label: i18n.global.t('payment.date'),
    field: 'createdAt',
    align: ColumnAlign.left,
    format: (val) => format(new Date((val as number) ?? 0), 'dd.MM.yyyy'),
    sortable: true,
    edit: false,
  },
  {
    name: 'amount',
    label: i18n.global.t('payment.amount'),
    field: 'amount',
    align: ColumnAlign.left,
    format: (val) => formatCurrency(val as number),
    sortable: true,
    edit: false,
  },
]);
</script>
