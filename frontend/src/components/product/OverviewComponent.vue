<template>
  <div>
    <!-- Links -->
    <div class="q-ml-sm">
      <p
        v-if="showDirectLink"
        @click.stop
      >
        {{ $t('direct_buy_link') }}: <a :href="directLink">{{ directLink }}</a>
      </p>
      <p
        v-if="showSellerLink"
        @click.stop
      >
        {{ $t('seller_link') }}: <a :href="sellerLink">{{ sellerLink }}</a>
      </p>
    </div>

    <!-- Timer -->
    <b class="q-mt-xs q-ml-sm">
      {{ $t('time_left') }}: <strong> 12:00:00 </strong>
    </b>

    <!-- Progress Bar -->
    <div class="q-mt-md q-ml-sm q-mr-sm">
      <q-linear-progress
        size="md"
        :value="progress"
        color="positive"
      />
      <div class="flex justify-between q-mt-sm">
        <b style="color: #21BA45"> {{ covered_amount }}{{ currency }} / {{ total_amount }}{{ currency }}</b>
        <b style="color: #21BA45"> {{ $t('player_bet') }} {{ userBet }}{{ currency }}</b>
      </div>
    </div>

    <!-- Winchances -->
    <div class="flex justify-between q-ma-sm">
      <b> {{ $t('average_chance') }}: {{ average_chance }}</b>
      <b> {{ $t('player_chance') }}: {{ user_chance }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

//Links
const directLink = 'https://polygon-software.ch/'
const sellerLink = 'https://polygon-software.ch/'
const showSellerLink = ref(true)
const showDirectLink = ref(true)

// Progess bar
const progress = ref(0.4)
const covered_amount = ref(400)
const total_amount = 1000
const userBet = ref(100)
const currency = ref('$')


// Winchances
const average_chance = ref('1/20')
const user_chance = ref('1/10')

//TODO: Implement methods to fetch data from database
</script>
