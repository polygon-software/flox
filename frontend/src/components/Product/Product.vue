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
          @click="openCommentSection"
          style="cursor: pointer"
        />
        <q-icon
          tag="share"
          name="share"
          @click="openShareMenu"
          style="cursor: pointer"
        />
      </div>
    </div>
    <q-dialog
      v-model="showComments"
    >
      <q-card>
        <q-card-section>
          <div>This is the comment section</div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('back')"
            @click="closeCommentSection"
            color="primary"
            flat
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showShareMenu"
    >
      <q-card>
        <q-card-section>
          <div>Here you can share this page</div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('back')"
            @click="closeShareMenu"
            color="primary"
            flat
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

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
      transition-next="fade"
      transition-prev="fade"
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
import {defineProps, ref, markRaw} from 'vue'
import OverviewComponent from './OverviewComponent.vue'
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
const showComments = ref(false)
const showShareMenu = ref(false)

/**
 * These are the images that will be displayed in the carousell.
 */
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

/**
 * If the product page should be separated into different tabs, they need to be defined here.
 * The content of each tab will be defined in a separate component.
 */
const selectedTab = ref('overview')
const tabs = [
  {
    name: 'overview',
    label: 'Overview',
    component: {
      name: markRaw(OverviewComponent),
    }
  },
  {
    name: 'description',
    label: 'Description',
    component: {
      name: markRaw(DescriptionComponent),
    }
  },
  {
    name: 'tickets',
    label: 'Ticket Distribution',
    component: {
      name: markRaw(TicketDistributionComponent),
    }
  },
]

//TODO: Fetch data from DB

/**
 * Toggles the "Like" (heart) symbol.
 */
function toogleLike() {
  liked.value = !liked.value
  //TODO: emit to database
}

/**
 * Toggles the bokmark symbol.
 */
function toogleBookmark() {
  bookmarked.value = !bookmarked.value
  //TODO: emit to database
}

/**
 * Opens the comment section, so that the user can leave or read comments.
 */
function openCommentSection() {
  showComments.value = true
}

function closeCommentSection() {
  showComments.value = false

}


/**
 * Allow the user to share this product site via Message Apps, Email, etc.
 */
function openShareMenu() {
  showShareMenu.value = true
}

function closeShareMenu() {
  showShareMenu.value = false
}


</script>

<style scoped>
</style>
