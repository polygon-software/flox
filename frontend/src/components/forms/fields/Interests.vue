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
      {{ $t('interests.select_interests', {max: max_interests}) }}
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
      {{ $t('interests.amount_selected', { amount: selectedInterests.length, max: max_interests }) }}
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
const max_interests = 5
type interest = {
  name: string,
  model: boolean
}

// TODO: could be done as a loop?
const interests = ref([
  {
    name: i18n.global.t('interests.cars'),
    value: CATEGORY.CARS,
    model: false,
  },
  {
    name: i18n.global.t('interests.celebrities'),
    value: CATEGORY.CELEBRITIES,
    model: false,
  },
  {
    name: i18n.global.t('interests.cooking'),
    value: CATEGORY.COOKING,
    model: false,
  },
  {
    name: i18n.global.t('interests.fashion'),
    value: CATEGORY.FASHION,
    model: false,
  },
  {
    name: i18n.global.t('interests.music'),
    value: CATEGORY.MUSIC,
    model: false,
  },
  {
    name: i18n.global.t('interests.outdoor'),
    value: CATEGORY.OUTDOOR,
    model: false,
  },
  {
    name: i18n.global.t('interests.sports'),
    value: CATEGORY.SPORTS,
    model: false,
  },
  {
    name: i18n.global.t('interests.technology'),
    value: CATEGORY.TECHNOLOGY,
    model: false,
  },
  {
    name: i18n.global.t('interests.tools'),
    value: CATEGORY.TOOLS,
    model: false,
  },
  {
    name: i18n.global.t('interests.travelling'),
    value: CATEGORY.TRAVELLING,
    model: false,
  },
  {
    name: i18n.global.t('interests.watches'),
    value: CATEGORY.WATCHES,
    model: false,
  },
])

const selectedInterests = computed(() => {
  const filteredInterests = interests.value.filter(item => {
    return item.model === true
  })

  const result = []
  for(const interest of filteredInterests){
    result.push(interest.value)
  }

  return result;
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
  else if (!interest.model && selectedInterests.value.length < max_interests) {
    interest.model = true
  }

  emit('change', selectedInterests)
}
</script>
