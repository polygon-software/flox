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
        v-for="interest in filteredInterests"
        :key="interest.name"
        :color="interest.model ? 'primary' : 'gray'"
        :text-color="interest.model ? 'white': 'black'"
        style="cursor: pointer;"
        clickable
        @click="clickChip(interest)"
      >
        {{ interest.name }}
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

const emit = defineEmits(['change'])
const search = ref('')

// All available interest categories
const max_interests = 5
type interest = {
  name: string,
  model: boolean
}
const interests = ref([
  {
    name: i18n.global.t('interests.cars'),
    model: false,
  },
  {
    name: i18n.global.t('interests.celebrities'),
    model: false,
  },
  {
    name: i18n.global.t('interests.cooking'),
    model: false,
  },
  {
    name: i18n.global.t('interests.fashion'),
    model: false,
  },
  {
    name: i18n.global.t('interests.music'),
    model: false,
  },
  {
    name: i18n.global.t('interests.outdoor'),
    model: false,
  },
  {
    name: i18n.global.t('interests.sports'),
    model: false,
  },
  {
    name: i18n.global.t('interests.technology'),
    model: false,
  },
  {
    name: i18n.global.t('interests.tools'),
    model: false,
  },
  {
    name: i18n.global.t('interests.travelling'),
    model: false,
  },
  {
    name: i18n.global.t('interests.watches'),
    model: false,
  },
])

const selectedInterests = computed(() => {
  return interests.value.filter(item => {
    return item.model === true
  })
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
 * Toggle a chip's selection
 * @param {interest} interest - the selected interest
 * @returns {void}
 */
function clickChip(interest: interest): void {
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
