<template>
  <h4>{{ $t('admin_panel.admin_panel') }}</h4>
  <q-card flat bordered>
    <q-card-section>
      <h5>
        {{ $t('admin_panel.system_notification') }}
      </h5>
      <p>
        {{ $t('admin_panel.broadcast_message') }}
      </p>
    </q-card-section>
    <q-card-section>
      <NotificationCreator />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import NotificationCreator from 'src/flox/modules/notification/components/NotificationCreator.vue';
</script>
