<template>
  <div>
    <h5 class="text-center"> {{ $t('messages') }}</h5>

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
      <MessagePreview
        v-for="message in filteredMessages"
        :key="message.id"
        :title="message.title"
        :received="message.received"
        :is-read="message.isRead"
        @click="openMessage(message)"
      >
      </MessagePreview>
      <q-dialog
        v-model="showDialog"
      >
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
      </q-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
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
const sort = ref('newest')
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
const showDialog = ref(false)

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
  showDialog.value = true
}

// Closes the dialog which contains the detail view of a message.
function closeMessage() {
  selectedMessage.value = null
  showDialog.value = false
}

</script>
