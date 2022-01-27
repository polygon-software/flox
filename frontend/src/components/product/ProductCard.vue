<template>
  <q-card
    style="width: 400px; cursor: pointer"
    class="q-mb-xl q-pa-sm"
    @click="openDetailView(product)"
  >

    <!-- Images -->
    <q-carousel
      v-model="currentPictureUuid"
      animated
      navigation
      infinite
    >
      <q-carousel-slide
        v-for="picture in product.pictures"
        :key="picture.uuid"
        :name="picture.uuid"
        :img-src="picture.url"
      />
    </q-carousel>

    <!-- Title and Icons -->
    <div class="flex justify-between items-center no-wrap">
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
          class="q-mr-sm"
          style="cursor: pointer;"
          @click.stop="icon.callback()"
        />
      </div>
    </div>
    <!-- Dialogs for clickable Icons -->
    <q-dialog
      v-for="dialog in iconDialogs"
      :key="dialog.key"
      v-model="dialog.model"
    >
      <q-card>
        <q-card-section>
          <div>{{ dialog.content }}</div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('buttons.back')"
            color="black"
            flat
            @click.stop=dialog.callback
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <OverviewComponent
      :product="product"
    />
  </q-card>
</template>

<script setup lang="ts">
import {ref, computed, defineProps, Ref} from 'vue'
import OverviewComponent from './OverviewComponent.vue'
import ProductCardDetail from 'components/dialogs/ProductCardDetailDialog.vue';
import {useQuasar} from 'quasar';

const props = defineProps({
  product: {
      required: true,
      type: Object, // TODO proper typing with Joi
  }
})

const $q = useQuasar()

// General
const pictures: Ref<Record<string, string>[]> = ref(props.product.pictures) as Ref<Record<string, string>[]>
const currentPictureUuid: Ref<string> = ref(pictures.value[0]?.uuid ?? '')
const liked = ref(false)
const bookmarked = ref(false)
const showComments = ref(false)
const showShareMenu = ref(false)

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
      callback: toggleBookmark
    },
    {
      tag: 'comment',
      name: 'forum',
      callback: toggleCommentSection
    },
    {
      tag: 'share',
      name: 'share',
      callback: toggleShareMenu
    }
  ]
})

const iconDialogs = computed(() => {
  return [
    {
      key: 'comments',
      model: showComments.value,
      content: 'This is the comment section',
      callback: toggleCommentSection
    },
    {
      key: 'share',
      model: showShareMenu.value,
      content: 'Here you can share this page',
      callback: toggleShareMenu
    }
  ]
})

//TODO: Fetch data from DB

/**
 * Toggles the "Like" (heart) symbol.
 * @returns {void}
 */
function toogleLike() {
  liked.value = !liked.value
  //TODO: emit to database
}

/**
 * Toggles the bookmark symbol.
 * @returns {void}
 */
function toggleBookmark() {
  bookmarked.value = !bookmarked.value
  //TODO: emit to database
}

/**
 * Opens the comment section, so that the user can leave or read comments.
 * @returns {void}
 */
function toggleCommentSection() {
  showComments.value = !showComments.value
}

/**
 * Allow the user to share this product site via Message Apps, Email, etc.
 * @returns {void}
 */
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value
}


/**
 * Opens the detailed view of a product in dialog
 * @param {Record<string, unknown>} product - the selected product
 * @returns {void}
 */
function openDetailView(product: Record<string, unknown>) {
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
