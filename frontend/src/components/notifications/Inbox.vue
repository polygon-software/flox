<template>
  <q-card style="width: 350px; height: 500px; overflow: hidden;">
    <h5 class="text-center"> {{ $t('notifications.messages') }}</h5>

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
            :label="$t('buttons.back')"
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
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Sorting -->
      <q-select
        v-model="sort"
        class="q-my-md"
        style="width: 125px"
        borderless
        dense
        :options="options"
        map-options
        emit-value
        :label="$t('general.sort_by')"
      />

      <!-- Messages -->
      <q-scroll-area
        style="height: 300px;"
        class="q-pb-md"
      >
        <MessagePreview
          v-for="message in filteredMessages"
          :key="message.uuid"
          :title="message.title"
          :received="message.received"
          :is-read="message.isRead"
          :content="message.content"
          style="width: 300px; height: 75px;"
          @click="openMessage(message)"
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
import {computed, defineProps, Ref, ref} from 'vue'
import { i18n } from 'boot/i18n';
import MessagePreview from 'components/notifications/MessagePreview.vue';
import MessageDetail from 'components/notifications/MessageDetail.vue';
import {Notification} from 'src/data/types/Notification';
import {executeMutation} from 'src/helpers/data-helpers';
import {MARK_NOTIFICATION_AS_READ} from 'src/data/mutations/NOTIFICATIONS';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  notifications: {
    default: () => [],
    type: Array,
  },
})

// Search and sort
const options = [
  {
    label: i18n.global.t('general.newest'),
    value: 'newest',
  },
  {
    label: i18n.global.t('general.oldest'),
    value: 'oldest',
  }
]
const search = ref('')
const sort = ref(options[0].value)

// Open message
const selectedMessage: Ref<Notification|null|undefined> = ref()
const showMessageDetail: Ref<boolean> = ref(false)

// Sorts the messages according to the selected parameter
const sortedMessages = computed(() => {
  const notifications = props.notifications as Notification[]
  if (sort.value === 'oldest') {
    return notifications.slice().sort((a, b) => new Date(a.received).getTime() - new Date(b.received).getTime())
  }
  else {
    return notifications.slice().sort((b, a) => new Date(a.received).getTime() - new Date(b.received).getTime())
  }
})

// Filter the messages by checking their title and content
const filteredMessages = computed(() => {
  return sortedMessages.value.filter(msg => {
    return msg.title.toLowerCase().includes(search.value.toLowerCase()) || msg.content.toLowerCase().includes(search.value.toLowerCase())
  })
})

/**
 * Opens the dialog which contains the detail view of a notification.
 * @param {Message} notification - the notification that was selected
 * @returns {void}
 */
function openMessage(notification: Notification) {
  executeMutation(
    MARK_NOTIFICATION_AS_READ,
    {
      uuid: notification.uuid,
    }
  ).catch((e) => {
    console.error(e);
  })
  selectedMessage.value = notification
  showMessageDetail.value = true
}


/**
 * Closes the dialog which contains the detail view of a message. Also sets the message status to "read"
 * @returns {void}
 */
function closeMessage() {
  selectedMessage.value = null
  showMessageDetail.value = false
}

</script>
