<template>
  <q-card
    class="text-center"
    style="width: 500px"
    flat
  >
    <!-- Searchbar -->
    <q-input
      v-model="search"
      dense
      rounded
      outlined
      type="search"
      class="q-mb-md"
    >
      <template #append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Interests -->
    <p
      class="q-ma-md col"
      style="font-size: medium"
    >
      {{ $t('interests.select_interests', { max: maxInterests }) }}
    </p>
    <q-scroll-area
      style="height: 125px;"
      class="q-ma-md col"
    >
      <q-chip
        v-for="interestChip in filteredInterests"
        :key="interestChip.name"
        :color="interestChip.model ? 'primary' : 'gray'"
        :text-color="interestChip.model ? 'white': 'black'"
        style="cursor: pointer;"
        clickable
        @click="clickChip(interestChip)"
      >
        {{ interestChip.name }}
      </q-chip>
    </q-scroll-area>
    <p
      class="q-ma-md col"
      style="font-size: medium"
    >
      {{ $t('interests.amount_selected', { amount: selectedInterests.length, max: maxInterests }) }}
    </p>
  </q-card>

</template>

<script setup lang="ts">
import {computed, defineEmits, ref} from 'vue'
import { i18n } from 'boot/i18n';
import {CATEGORY} from '../../../../../shared/definitions/ENUM';

const emit = defineEmits(['change'])
const search = ref('')

// All available interest categories
const maxInterests = 5
type interest = {
  name: string,
  model: boolean
}

// TODO: could be done as a loop?
const interests = ref([
  {
    name: i18n.global.t('categories.cars'),
    value: CATEGORY.CARS,
    model: false,
  },
  {
    name: i18n.global.t('categories.celebrities'),
    value: CATEGORY.CELEBRITIES,
    model: false,
  },
  {
    name: i18n.global.t('categories.cooking'),
    value: CATEGORY.COOKING,
    model: false,
  },
  {
    name: i18n.global.t('categories.fashion'),
    value: CATEGORY.FASHION,
    model: false,
  },
  {
    name: i18n.global.t('categories.music'),
    value: CATEGORY.MUSIC,
    model: false,
  },
  {
    name: i18n.global.t('categories.outdoor'),
    value: CATEGORY.OUTDOOR,
    model: false,
  },
  {
    name: i18n.global.t('categories.sports'),
    value: CATEGORY.SPORTS,
    model: false,
  },
  {
    name: i18n.global.t('categories.technology'),
    value: CATEGORY.TECHNOLOGY,
    model: false,
  },
  {
    name: i18n.global.t('categories.tools'),
    value: CATEGORY.TOOLS,
    model: false,
  },
  {
    name: i18n.global.t('categories.travelling'),
    value: CATEGORY.TRAVELLING,
    model: false,
  },
  {
    name: i18n.global.t('categories.watches'),
    value: CATEGORY.WATCHES,
    model: false,
  },
])

const selectedInterests = computed(() => {
  return  interests.value
    .filter((interest) => interest.model)
    .map((interest) => interest.value)
})

// Sorts the interests alphabetically
const sortedInterests = computed(() => {
  return interests.value.slice().sort((a, b) => a.name.localeCompare(b.name))
})

// Filter the interests by checking their name
const filteredInterests = computed(() => {
  return sortedInterests.value.filter(msg => {
    return msg.name.toLowerCase().includes(search.value.toLowerCase())
  })
})

/**
 * On Clicking a chip, toggle it
 * @param {interest} interest - the chip's content
 * @returns {void}
 */
function clickChip(interest: interest) {
  // Deselect is always possible
  if (interest.model) {
    interest.model = false
  }

  // Not at maximum number of selected interests
  else if (!interest.model && selectedInterests.value.length < maxInterests) {
    interest.model = true
  }

  emit('change', selectedInterests)
}
</script>
