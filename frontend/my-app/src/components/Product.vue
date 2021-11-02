<template>
  <q-card
    style="width: 500px;"
  >
    <!-- Images -->
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
    >
      <q-carousel-slide
        v-for="(slide, index) in slides"
        :key="index"
        :name="slide.id"
        :img-src="slide.url"
      />
    </q-carousel>

    <!-- Title and Icons -->
    <div class="flex justify-between items-center">
      <h5 class="col">{{ title }}</h5>
      <div
        class="q-gutter-md"
        style="justify-content: flex-end; font-size: x-large"
      >
        <q-icon
          tag="like"
          :name="liked ? 'favorite' : 'favorite_border'"
          @click="toogleLike"
          style="cursor: pointer;"
        />
        <q-icon
          tag="bookmark"
          :name="bookmarked ? 'bookmark' : 'bookmark_border'"
          @click="toogleBookmark"
          style="cursor: pointer"
        />
        <q-icon
          tag="comment"
          name="forum"
          @click="postComment"
          style="cursor: pointer"
        />
        <q-icon
          tag="share"
          name="share"
          @click="shareProduct"
          style="cursor: pointer"
        />
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="q-mt-xs text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="overview" label="Overview" />
      <q-tab name="description" label="Description" />
      <q-tab name="tickets" label="Ticket Distribution" />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
    >
      <!-- Summary Tab -->
      <q-tab-panel name="overview">
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
      </q-tab-panel>

      <!-- Description -->
      <q-tab-panel name="description">
        {{ productDetails }}
      </q-tab-panel>

      <!-- Statistics -->
      <q-tab-panel name="tickets">
        Enter the statistics component here.
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'

const props = defineProps({
  dbReference: {
    required: true,
    type: String
  },
})

// General
const title = 'Product Card'
const slide = ref(1)
const liked = ref(false)
const bookmarked = ref(false)
const slides = [
  {
    id: 1,
    url: 'https://cdn.quasar.dev/img/mountains.jpg'
  },
  {
    id: 2,
    url: 'https://cdn.quasar.dev/img/parallax1.jpg'
  },
  {
    id: 3,
    url: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    id: 4,
    url: 'https://cdn.quasar.dev/img/quasar.jpg'
  }
]

// Tabs
const tab = ref('overview')

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

// Product details
const productDetails = 'Lorem ipsum...'


//TODO: Implement methods to fetch product and user attributes from database

function toogleLike() {
  liked.value = !liked.value
  //TODO: emit to database
}

function toogleBookmark() {
  bookmarked.value = !bookmarked.value
  //TODO: emit to database
}

function postComment() {
  //TODO: open comment section
  console.log('Open comment section')
}

function shareProduct() {
  //TODO: open share product
  console.log('Sharing product')
}

function followLink(link: string | URL | undefined) {
  window.open(link)
}
</script>

<style scoped>
</style>
