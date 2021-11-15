<template>
  <q-card>
    <strong>{{ props.title }}</strong>
    <p>{{ received }}</p>
    <p>{{ content }}</p>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  received: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String, //todo: needs to be component
  }
})

</script>
