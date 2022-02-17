<template>
  <q-list
    bordered
    separator
  >
    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.username') }}:</p>
          <p class="col-7">{{ props.user.username }}</p>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.full_name') }}:</p>
          <p class="col-7">{{ props.user.fullName }}</p>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.address') }}:</p>
          <p class="col-7">{{ props.user.address.prettyString() }}</p>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.phone_number') }}:</p>
          <p class="col-7">{{ props.user.phone }}</p>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.email') }}:</p>
          <p class="col-7">
            {{ props.user.email }}
          </p>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <div class="row flex content-center">
          <p class="col-5">{{ $t('account_data.birthdate') }}:</p>
          <p class="col-7">
            {{ formatDate(props.user.birthdate) }}
          </p>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { defineProps } from 'vue';
import { User } from 'src/data/types/User';
import { formatDate } from 'src/helpers/format-helpers';

const props = defineProps({
  user: {
    type: User,
    required: true
  },
});

</script>

