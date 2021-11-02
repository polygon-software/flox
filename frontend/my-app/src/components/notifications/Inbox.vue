<template>
  <div>
    <h5 class="text-center">Messages</h5>

    <!-- Searchbar -->
    <q-input
      v-model="search"
      dense
      rounded
      outlined
      type="search"
      class="q-mb-md"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Sorting -->
    <q-option-group
      v-model="sort"
      :options="options"
      color="primary"
      inline
    />

    <!-- Messages -->
    <div>
      <Message
        v-for="message in fitleredMessages"
        :key="message.id"
        :title="message.title"
        :received="message.received"
        :content="message.content"
        :isRead="message.isRead"
      >
      </Message>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import Message from 'components/notifications/Message.vue';

const props = defineProps({
  dbRef: {
    required: true,
    type: String
  }
})

// Search and sort
const search = ref('')
const sort = ref('newest')
const options = [
  {
    label: 'Newest',
    value: 'newest',
  },
  {
    label: 'Oldest',
    value: 'oldest',
  }
]


const messages = ref([
  {
    id: '0',
    title: 'You have won Product X',
    received: '2021-09-27T12:12:03',
    content: 'Dear Derp...',
    isRead: false,
  },
  {
    id: '1',
    title: 'User Y sent you a message',
    received: '2021-09-24T18:23:51',
    content: 'Derpina says...',
    isRead: true,
  },
  {
    id: '2',
    title: 'These products might interest you',
    received: '2021-09-16T07:45:38',
    content: 'Check out...',
    isRead: true,
  },
])

// Sorts the messages according to the selected parameter
const sortedMessages = computed(() => {
  if (sort.value === 'oldest') {
    return messages.value.slice().sort((a, b) => new Date(a.received).getTime() - new Date(b.received).getTime())
  }
  else {
    return messages.value.slice().sort((b, a) => new Date(a.received).getTime() - new Date(b.received).getTime())
  }
})

// Filter the messages by checking their title and content
const fitleredMessages = computed(() => {
  return sortedMessages.value.filter(msg => {
    return msg.title.toLowerCase().includes(search.value.toLowerCase()) || msg.content.toLowerCase().includes(search.value.toLowerCase())
  })
})

</script>
