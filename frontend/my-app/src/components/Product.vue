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
    <div class="row q-gutter-md">
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

    <!-- Progress Bar -->
    <div class="row">
      <p style="color: #21BA45"> {{ covered_amount }}{{ currency }} of {{ total_amount }}{{ currency }} covered</p>
      <q-linear-progress
        size="md"
        :value="progress"
        color="positive"
      />
    </div>

    <!-- Winchances -->
    <div class="row m-p-t-md q-gutter-md">
      <p> Average chance: {{ average_chance }}</p>
      <p> Your chance: {{ user_chance }}</p>
    </div>
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

const title = 'Product Card'
const slide = ref(1)
const liked = ref(false)
const bookmarked = ref(false)

// Progess bar
const progress = ref(0.4)
const covered_amount = ref(400)
const total_amount = 1000
const currency = ref('$')

// Winchances
const average_chance = ref('1/10')
const user_chance = ref('1/8')

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
