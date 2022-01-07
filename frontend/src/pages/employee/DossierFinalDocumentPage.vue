<template>
  <q-page class="flex flex-center">
      <!-- A4 page container -->
      <q-card class="page">
        <!-- Logo + address row -->
        <div class="row justify-between">
          <img
            alt="S.O.I. AG"
            :src="require('src/assets/soi-logo.png')"
            style="height: 50px"
            class="q-ma-sm"
          >
          <p class="text-grey-5" style="margin-top: 16px">
            {{infoString}}
          </p>
        </div>

        <!-- Contact info card -->
        <q-card
          class="bg-grey-1"
        >
          <strong>
            {{$t('dossier.contact')}}
          </strong>
        </q-card>

      </q-card>
  </q-page>
</template>

<script setup lang="ts">
const infoString = 'Bahnhofstrasse 1 | 6000 Zürich | 043 222 22 22'
</script>

<style scoped>
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 10mm auto;
  padding: .5cm 1cm .5cm 1cm;
}

@page {
  size: A4;
  margin: 0;
}

/* TODO ensure this is actually needed/use on simple preview page */
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
</style>
