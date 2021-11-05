<template>
  <div>
    <!-- Links -->
    <div class="row q-gutter-md">
      <p v-if="showDirectLink">
        Buy right now: <q-icon name="shopping_cart" style="cursor: pointer" color="primary" @click="followLink(directLink)" />
      </p>
      <p v-if="showSellerLink">
        Find more products: <q-icon name="home" style="cursor: pointer" color="primary" @click="followLink(sellerLink)" />
      </p>
    </div>

    <!-- Timer -->
    <b class="q-mt-xs">
      Time left: <span> 12:00:00 </span>
    </b>

    <!-- Progress Bar -->
    <div class="q-mt-md">
      <q-linear-progress
        class="q-mt-xs"
        size="md"
        :value="progress"
        color="positive"
      />
      <div class="flex justify-between q-mt-sm">
        <b style="color: #21BA45"> {{ covered_amount }}{{ currency }} of {{ total_amount }}{{ currency }} covered</b>
        <b style="color: #21BA45"> Your bet {{ userBet }}{{ currency  }}</b>
      </div>
    </div>

    <!-- Winchances -->
    <div class="flex justify-between q-mt-sm">
      <b> Average chance: {{ average_chance }}</b>
      <b> Your chance: {{ user_chance }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

//Links
const directLink = 'https://polygon-software.ch/'
const sellerLink = 'https://uzh.ch'
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

function followLink(link: string | URL | undefined) {
  window.open(link)
}
</script>
