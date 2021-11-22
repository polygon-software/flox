<template>
  <q-card
    style="width: 400px; cursor: pointer"
    @click="openDetailView(product)"
    class="q-mb-xl q-pa-sm"
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
      <h5 class="q-ml-sm">{{ product.title }}</h5>
      <div
        class="q-gutter-md"
        style="justify-content: flex-end; font-size: x-large"
      >
        <q-icon
          v-for="icon in icons"
          :key="icon.tag"
          :tag="icon.tag"
          :name="icon.name"
          @click.stop="icon.callback()"
          class="q-mr-sm"
          style="cursor: pointer;"
        />
      </div>
    </div>
    <!-- Dialogs for clickable Icons -->
    <q-dialog
      v-for="dialog in icon_dialogs"
      :key="dialog.key"
      v-model="dialog.model"
    >
      <q-card>
        <q-card-section>
          <div>{{ dialog.content }}</div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('back')"
            @click.stop=dialog.callback
            color="black"
            flat
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <OverviewComponent/>
  </q-card>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import OverviewComponent from './OverviewComponent.vue'
import ProductCardDetail from 'components/dialogs/ProductCardDetailDialog.vue';
import {useQuasar} from 'quasar';

const props = defineProps({
  // dbReference: {
  //   required: true,
  //   type: String
  // },

  product: {
      required: true,
      type: Object,
  }
})

const $q = useQuasar()

// General
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
 * Here are the icons and icon dialogs defined.
 */
const icons = computed(() => {
  return [
    {
      tag: 'like',
      name: liked.value ? 'favorite' : 'favorite_border',
      callback: toogleLike,
    },
    {
      tag: 'bookmark',
      name: bookmarked.value ? 'bookmark' :' bookmark_border',
      callback: toogleBookmark
    },
    {
      tag: 'comment',
      name: 'forum',
      callback: openCommentSection
    },
    {
      tag: 'share',
      name: 'share',
      callback: openShareMenu
    }
  ]
})

const icon_dialogs = computed(() => {
  return [
    {
      key: 'comments',
      model: showComments.value,
      content: 'This is the comment section',
      callback: closeCommentSection
    },
    {
      key: 'share',
      model: showShareMenu.value,
      content: 'Here you can share this page',
      callback: closeShareMenu
    }
  ]
})

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

// Opens the detailed view of a product in dialog
function openDetailView(product: unknown) {
  $q.dialog({
    title: 'DetailView',
    component: ProductCardDetail,
    componentProps: {
      product: product
    }
  })
}
</script>

<style scoped>
</style>
