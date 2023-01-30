<template>
  <q-card
    class="justify-center q-pa-lg q-pr-xl"
    style="border-radius: 7px; width: 100%"
  >
    <!-- Card with image -->
    <q-card-section v-if="card.imagePath" horizontal>
      <q-card-section class="col-4">
        <div class="column items-center">
          <!-- Label text -->
          <div class="text-center text-primary q-ma-lg">
            {{ card.label }}
          </div>
          <!-- Card image -->
          <div style="width: 70%">
            <q-img :src="card.imagePath" />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="column">
        <slot />
      </q-card-section>
    </q-card-section>

    <!-- Card without image -->
    <q-card-section v-else horizontal>
      <q-card-section>
        <div class="column">
          <slot />
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import FormCard from '../../types/FormCard';

const props = defineProps({
  card: {
    type: Object as PropType<FormCard>,
    required: true,
  },
});
</script>
