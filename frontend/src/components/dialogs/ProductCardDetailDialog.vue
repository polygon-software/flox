<template>
  <q-dialog
    ref="dialog"
    title="DetailView"
    @hide="hide"
  >
    <q-card class="q-pa-md" style="width: 800px;">
      <q-card-section>

        <!-- Images -->
        <q-carousel
          v-model="currentPictureUuid"
          animated
          navigation
          infinite
          arrows
        >
          <q-carousel-slide
            v-for="picture in product.pictures"
            :key="picture.uuid"
            :name="picture.uuid"
            :img-src="picture.url"
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
              class="q-mr-sm"
              style="cursor: pointer;"
              @click="icon.callback()"
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
                :label="$t('buttons.back')"
                color="primary"
                flat
                @click.stop=dialog.callback
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

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
              :product="product"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :label="$t('buttons.back')"
          color="black"
          flat
          @click="hide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, markRaw, computed, Ref, defineProps} from 'vue'
import OverviewComponent from '../product/OverviewComponent.vue'
import DescriptionComponent from '../product/DescriptionComponent.vue'
import TicketDistributionComponent from '../product/TicketDistributionComponent.vue'
import {QDialog} from 'quasar';

const dialog: Ref<QDialog|null> = ref(null)
// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  //eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

const props = defineProps({
  product: {
      required: true,
      type: Object,
  }
})

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
      callback: toogleBookmark
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

const icon_dialogs = computed(() => {
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
function toogleBookmark() {
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

</script>

<style scoped>
</style>
