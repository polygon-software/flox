<template>
  <q-page class="flex flex-center">
      <q-card class="page">
        <div class="subpage">
          TODO content
        </div>
      </q-card>
  </q-page>
</template>

<script setup lang="ts">

</script>

<style scoped>
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  background: white;
}
.subpage {
  padding: 1cm;
  border: 5px solid red;
  height: 257mm;
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
