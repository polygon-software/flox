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
      TODO
      <q-no-ssr>
        <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>
      </q-no-ssr>

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
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  }
}
const series = [{
  name: 'series-1',
  data: [30, 40, 45, 50, 49, 60, 70, 91]
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
