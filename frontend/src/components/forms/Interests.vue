<template>
  <q-card
    class="q-pa-sm text-center"
    style="width: 500px"
    :rules="[selectedInterestsCount > 0 && selectedInterestsCount < 6 || $t('select_interests', {max: max_interests})]"
  >
    <!-- Title -->
    <h5 class="q-mb-md">
      {{ $t('interests') }}
    </h5>

    <!-- Searchbar -->
    <q-input
      v-model="search"
      dense
      rounded
      outlined
      type="search"
      class="q-mb-md"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Interests -->
    <p
      class="q-ma-md col"
      style="font-size: medium"
    >
      {{ $t('select_interests', {max: max_interests}) }}
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
      {{ $t('amount_selected', { amount: selectedInterestsCount, max: max_interests }) }}
    </p>
  </q-card>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { i18n } from 'boot/i18n';

const search = ref('')

// All available interest categories
const max_interests = 5
type interest = {
  name: string,
  model: boolean
}
const interests = ref([
  {
    name: i18n.global.t('cars'),
    model: false,
  },
  {
    name: i18n.global.t('celebrities'),
    model: false,
  },
  {
    name: i18n.global.t('cooking'),
    model: false,
  },
  {
    name: i18n.global.t('fashion'),
    model: false,
  },
  {
    name: i18n.global.t('music'),
    model: false,
  },
  {
    name: i18n.global.t('outdoor'),
    model: false,
  },
  {
    name: i18n.global.t('sports'),
    model: false,
  },
  {
    name: i18n.global.t('technology'),
    model: false,
  },
  {
    name: i18n.global.t('tools'),
    model: false,
  },
  {
    name: i18n.global.t('travelling'),
    model: false,
  },
  {
    name: i18n.global.t('watches'),
    model: false,
  },
])


// Sorts the interests alphabetically
const sortedInterests = computed(() => {
    return interests.value.slice().sort((a, b) => a.name.localeCompare(b.name))
})

// Filter the interests by checking their name
const filteredInterests = computed(() => {
  return sortedInterests.value.filter(msg => {
    return msg.name.toLowerCase().includes(search.value.toLowerCase()) || msg.name.toLowerCase().includes(search.value.toLowerCase())
  })
})

const selectedInterestsCount = computed(() => {
  let selectedItems = 0
  for (const key of interests.value) {
    if (key.model) {
      selectedItems += 1
    }
  }
  return selectedItems
})

function clickChip(interest: interest) {
  // Deselect is always possible
  if (interest.model) {
    interest.model = false
  }

  // Not at maximum number of selected interests
  else if (!interest.model && selectedInterestsCount.value < max_interests) {
    interest.model = true
  }
}
</script>
