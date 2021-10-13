<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center column">
        <div class="row">
          <img
              alt="Polygon Software"
              src="https://media-exp1.licdn.com/dms/image/C4D0BAQEI1LFXsM4DVA/company-logo_200_200/0/1593964710523?e=2159024400&v=beta&t=k1qIEpVNRq-GBvW1fZt2SKvcuq59WL8J0IuLW0qMSG4"
              style="width: 200px; height: 200px">
          <h4>Hello World! Test Application is running.</h4>
        </div>
        <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
        <div class="row" style="margin-top: 100px">
          <TestTable/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import TestTable from './components/TestTable.vue'

export default {
  name: 'LayoutDefault',

  components: {
    TestTable
  },
}
</script>
