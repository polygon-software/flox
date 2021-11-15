<template>
  <q-card style="width: 250px; height: 500px; overflow: hidden;">
    <h5 class="text-center"> {{ $t('messages') }}</h5>

    <!-- Message Details -->
    <q-card-section v-if="showMessageDetail">
      <q-card>
        <q-card-section>
          <MessageDetail
            :content="selectedMessage.content"
            :received="selectedMessage.received"
            :title="selectedMessage.title"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="$t('back')"
            color="primary"
            flat
            @click="closeMessage"
          />
        </q-card-actions>
      </q-card>
    </q-card-section>

    <!-- Message items -->
    <q-card-section
      v-else
    >
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
      <q-select
        class="q-my-md"
        style="width: 125px"
        borderless
        dense
        v-model="sort"
        :options="options"
        :label="$t('sort_by')"
      />

      <!-- Messages -->
      <q-scroll-area
        style="height: 300px;"
        class="q-pb-md"
      >
        <MessagePreview
          v-for="message in filteredMessages"
          :key="message.id"
          :title="message.title"
          :received="message.received"
          :is-read="message.isRead"
          @click="openMessage(message)"
          style="width: 90%; height: 75px;"
        >
        </MessagePreview>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
/**
 * This component displays a message inbox, which contains message items. The messages can be filtered and sorted.
 */
import { computed, ref } from 'vue'
import { i18n } from 'boot/i18n';
import MessagePreview from 'components/notifications/MessagePreview.vue';
import MessageDetail from 'components/notifications/MessageDetail.vue';

const props = defineProps({
  dbRef: {
    required: true,
    type: String
  }
})

// Search and sort
const search = ref('')
const sort = ref(i18n.global.t('newest'))
const options = [
  {
    label: i18n.global.t('newest'),
    value: 'newest',
  },
  {
    label: i18n.global.t('oldest'),
    value: 'oldest',
  }
]

// Open message
const selectedMessage = ref()
const showMessageDetail = ref(false)

// Needs to be defined somewhere else...
type Message = {
  id: string,
  title: string,
  received: string,
  content: string,
  isRead: boolean
}

// This would be fetched from the DB
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
  {
    id: '3',
    title: 'Happy Birthday',
    received: '2021-08-26T00:00:00',
    content: 'Hey derp, wish you all the best...',
    isRead: false,
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
const filteredMessages = computed(() => {
  return sortedMessages.value.filter(msg => {
    return msg.title.toLowerCase().includes(search.value.toLowerCase()) || msg.content.toLowerCase().includes(search.value.toLowerCase())
  })
})

// Opens the dialog which contains the detail view of a message.
function openMessage(message: Message) {
  selectedMessage.value = message
  showMessageDetail.value = true
}

// Closes the dialog which contains the detail view of a message. Also sets the message status to "read"
function closeMessage() {
  selectedMessage.value.isRead = true
  selectedMessage.value = null
  showMessageDetail.value = false
}

</script>
