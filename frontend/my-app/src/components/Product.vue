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
    <div class="row q-mt-md q-gutter-md">
      <h5 class="col">{{ title }}</h5>
      <div class="q-gutter-md" style="justify-content: flex-end">
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
      <q-tab name="summary" label="Summary" />
      <q-tab name="description" label="Description" />
      <q-tab name="tickets" label="Ticket Distribution" />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
    >
      <!-- Summary Tab -->
      <q-tab-panel name="summary">
        <!-- Links -->
        <div class="row q-gutter-md">
          <q-btn
            label="Buy directley"
            color="primary"
            v-if="showDirectLink"
          />
          <q-btn
            label="Seller page"
            color="primary"
            v-if="showSellerLink"
          />
        </div>

        <!-- Progress Bar -->
        <div class="row q-mt-lg">
          <p style="color: #21BA45"> {{ covered_amount }}{{ currency }} of {{ total_amount }}{{ currency }} covered</p>
          <q-linear-progress
            size="md"
            :value="progress"
            color="positive"
          />
        </div>

        <!-- Winchances -->
        <div class="row q-mt-sm q-gutter-xl">
          <p> Average chance: {{ average_chance }}</p>
          <p> Your chance: {{ user_chance }}</p>
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
  refernce: {
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
const tab = ref('summary')

//Links
const directLink = "https://www.polygon-software.ch"
const sellerLink = "https://www.uzh.ch"
const showSellerLink = ref(true)
const showDirectLink = ref(true)

// Progess bar
const progress = ref(0.4)
const covered_amount = ref(400)
const total_amount = 1000
const currency = ref('$')

// Winchances
const average_chance = ref('1/10')
const user_chance = ref('1/8')

// Product details
const productDetails = "Lorem ipsum..."


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
  console.log("Open comment section")
}

function shareProduct() {
  //TODO: open share product
  console.log("Sharing product")
}
</script>

<style scoped>
</style>
