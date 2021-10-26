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

    <q-tab-panels v-model="currentTab" animated>
      <q-tab-panel
          v-for="tab in props.tabs"
          :key="tab.name"
          :name="tab.name"
          >
          <slot />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue'

/**
 * This component will probably be deleted!
 */

/**
 * The TabPanel component can hold mutiple tabs. There's always only one active tab.
 * The component receives an array of objects with the following attributes:
 * @name: Name of the tab
 * @label: The displayed name of a tab
 */

const props = defineProps({
  tabs: {
    required: true,
    type: Array,
  }
})

//Indicates which tab is currently opend
let currentTab = ref(props.tabs[0].name)

</script>

<style scoped>

</style>
