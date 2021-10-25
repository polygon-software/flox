<template>
  <q-card>
    <q-tabs
      v-model="currentTab"
      dense
      class="text-grey"
      active-color="dark"
      indicator-color="dark"
      align="justify"
      narrow-indicator
    >
    <q-tab
        v-for="tab in props.tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
    />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel
          v-for="tab in props.tabs"
          :key="tab.name"
          :name="tab.name"
          >
          {{ tab.content }}
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'

/**
 * The TabPanel component can hold mutiple tabs...
 */

const props = defineProps({
  tabs: {
    required: true,
    type: Array,
  }
})

let currentTab = ref(props.tabs[0].name)

</script>

<style scoped>

</style>
