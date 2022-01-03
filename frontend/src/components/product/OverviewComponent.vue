<template>
  <div>
    <!-- Links -->
    <div class="q-ml-sm">
      <p
        v-if="showDirectLink"
        @click.stop
      >
        {{ $t('products.direct_buy_link') }}: <a :href="product.directBuyLink">{{ product.directBuyLink }}</a>
      </p>
      <p
        v-if="showSellerLink"
        @click.stop
      >
        {{ $t('products.seller_link') }}: <a :href="product.brandLink">{{ product.brandLink }}</a>
      </p>
    </div>

    <!-- Timer -->
    <strong class="q-mt-xs q-ml-sm">
      {{ $t('products.time_left') }}: <strong> 12:00:00 </strong>
    </strong>

    <!-- Progress Bar -->
    <div class="q-mt-md q-ml-sm q-mr-sm">
      <q-linear-progress
        size="md"
        :value="progress"
        color="positive"
      />
      <div class="flex justify-between q-mt-sm">
        <strong style="color: #21BA45"> {{ covered_amount }}{{ currency }} / {{ product.value }}{{ product.currency }}</strong>
        <strong style="color: #21BA45"> {{ $t('products.player_bet') }} {{ userBet }}{{ currency }}</strong>
      </div>
    </div>

    <!-- Winchances -->
    <div class="flex justify-between q-ma-sm">
      <strong> {{ $t('products.average_chance') }}: {{ average_chance }}</strong>
      <strong> {{ $t('products.player_chance') }}: {{ user_chance }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'

const props = defineProps({
  product: {
    required: true,
    type: Object, // TODO proper typing with Joi
  }
})

const showSellerLink = ref(true)
const showDirectLink = ref(true)

// Progress bar
const progress = ref(0.4)
const covered_amount = ref(400)
const userBet = ref(100)
const currency = ref('$')


// Winchances
const average_chance = ref('1/20')
const user_chance = ref('1/10')

//TODO: Implement methods to fetch data from database
</script>
