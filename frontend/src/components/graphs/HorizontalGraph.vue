<template>
  <!-- Container -->
  <div
    class="q-pa-lg full-width"
    style="height: 280px;"
  >
    <!-- Content -->
    <div
      class="column justify-between full-height"
      style="background: lightblue;"
    >
        <apexchart
          height="280"
          type="line"
          :options="options"
          :series="series"
        />

      <!-- Button Row -->
      <div class="row full-width justify-end">
        <q-btn
          :label="$t('buttons.copy')"
          icon="content_copy"
          style="border-radius: 0"
          text-color="primary"
          no-caps
          unelevated
          outline
          @click="copyContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShareDialog from 'components/dialogs/ShareDialog.vue';
import {useQuasar} from 'quasar';


const $q = useQuasar()

// TODO
const options = {
  chart: {
    id: 'vuechart-example'
  },
  // xaxis: {
  //   categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  // }
}
const series = [{
  name: 'series-1',
  data: Array.from({length: 200}, () => Math.random())
}]

/**
 * Copies the graph's content
 * @returns {void}
 */
function copyContent(){
  console.log('TODO: copy content')
  $q.dialog({
    component: ShareDialog,
    componentProps: {
      q: $q
    },
  }).onOk(() => {
    console.log('SHARE')
  })
}

</script>

<style scoped>

</style>
