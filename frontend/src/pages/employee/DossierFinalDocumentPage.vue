<template>
  <q-page class="flex flex-center">
      <!-- A4 page container -->
      <q-card class="page">
        <!-- Logo + address row -->
        <div class="row justify-between">
          <img
            alt="S.O.I. AG"
            :src="require('src/assets/soi-logo.png')"
            style="height: 15mm"
            class="q-ma-sm"
          >
          <p class="text-grey-5" style="margin-top: 5mm">
            {{infoString}}
          </p>
        </div>

        <!-- Contact info card -->
        <q-card
          class="bg-grey-1 sub-card"
          style="margin-top: 5mm"
        >
          <strong style="margin-bottom: 1mm">
            {{$t('dossier.contact')}}
          </strong>

          <div class="row">
            <!-- Left column -->
            <div
              class="column col-6"
              style="padding-right: 5mm"
            >
              <div class="info-field">
                {{ contactInfo.fullName }}
              </div>
              <div class="info-field">
                {{ contactInfo.street }}
              </div>
              <div class="info-field">
                {{ contactInfo.zipCode }} {{ contactInfo.city }}
              </div>
            </div>

            <!-- Right column -->
            <div
              class="column col-6"
              style="padding-left: 5mm"
            >
              <div class="row">
                <div class="info-field">
                  {{ formatDate(dossierInfo.createdOn) }}
                </div>
              </div>
              <div class="info-field">
                {{ contactInfo.street }}
              </div>
              <div class="info-field">
                {{ contactInfo.zipCode }} {{ contactInfo.city }}
              </div>
            </div>
          </div>
        </q-card>

        <!-- Application info card -->
        <q-card
          class="bg-grey-1 sub-card"
        >
          <strong>
            {{$t('dossier.application')}}
          </strong>
        </q-card>

      </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {formatDate} from 'src/helpers/format-helpers';

// Info for top right-hand corner
const infoString = 'Bahnhofstrasse 1 | 6000 Zürich | 043 222 22 22'

// TODO replace with correct info from preceding form pages
const contactInfo = {
  fullName: 'Jusuf Amzai',
  email: 'email@adresse.ch',
  phone: '041 123 45 67',
  street: 'Sowiesostrasse 1',
  zipCode: '6003',
  city: 'Sowieso',
}

const dossierInfo = {
  createdOn: new Date(),
}
</script>

<style scoped>
/* Important: Measurements herein are in mm instead of px/em for printing reasons */
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 10mm auto;
  padding: .5cm 1cm .5cm 1cm;
}

.sub-card{
  padding: 3mm;
  margin-bottom: 3mm
}

/* Single info field (e.g. name) */
.info-field{
  background: white;
  padding: 1mm;
  border-radius: 1mm;
  outline: 1px solid lightgray;
  margin: 1mm 0 1mm 0
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
