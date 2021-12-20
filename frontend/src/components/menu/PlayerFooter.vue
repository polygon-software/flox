<template>
  <q-footer
    class="bg-primary shadow-5 row justify-center"
    style="height: 60px"
  >
    <div class="row justify-between" :style="'width: ' + (120 * navigationButtons.length).toString() + 'px'">
      <q-btn
        v-for="button in navigationButtons"
        :key="button.name"
        :icon="button.icon"
        :label="button.label"
        no-caps
        flat
        color="black"
        style="width: 120px"
      />
    </div>

  </q-footer>
</template>

<script setup lang="ts">

// TODO i18n
const navigationButtons = [
  {
    name: 'start',
    label: 'Start',
    icon: 'home',
    action: () => goHome()
  },
  {
    name: 'bets',
    label: 'Your Bets',
    icon: 'local_activity',
    action: () => goHome() // TODO
  },
  {
    name: 'discover',
    label: 'Discover',
    icon: 'explore',
    action: () => goHome() // TODO
  },
  {
    name: 'community',
    label: 'Community',
    icon: 'groups',
    action: () => goHome() // TODO
  },
]

/**
 * TODO
 * @returns {void}
 */
function goHome(){
  // TODO
}

</script>
