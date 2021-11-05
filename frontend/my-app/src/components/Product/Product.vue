<template>
  <q-card
    style="width: 500px;"
  >
    <!-- Images -->
    <q-carousel
      animated
      v-model="currentImage"
      arrows
      navigation
      infinite
    >
      <q-carousel-slide
        v-for="(slide, index) in images"
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
    <!-- Tab header -->
    <q-tabs
      v-model="selectedTab"
      dense
      class="q-mt-xs text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
      >
      </q-tab>
    </q-tabs>

    <q-separator />

    <!-- Tab content -->
    <q-tab-panels
      v-model="selectedTab"
      animated
      >
      <q-tab-panel
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
      >
        <component
          :is="tab.component.name"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'
import OverviewComponent from './OverviewComponent'
import DescriptionComponent from './DescriptionComponent.vue'
import TicketDistributionComponent from './TicketDistributionComponent.vue'

const props = defineProps({
  dbReference: {
    required: true,
    type: String
  },
})

// General
const title = 'Product Card'
const currentImage = ref(1)
const liked = ref(false)
const bookmarked = ref(false)
const images = [
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
const selectedTab = ref('overview')
const tabs = [
  {
    name: 'overview',
    label: 'Overview',
    component: {
      name: OverviewComponent,
    }
  },
  {
    name: 'description',
    label: 'Description',
    component: {
      name: DescriptionComponent,
    }
  },
  {
    name: 'tickets',
    label: 'Ticket Distribution',
    component: {
      name: TicketDistributionComponent,
    }
  },
]

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


</script>

<style scoped>
</style>
