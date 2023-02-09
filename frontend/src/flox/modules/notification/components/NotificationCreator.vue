<template>
  <q-card flat>
    <q-card-section>
      <q-splitter v-model="splitterModel">
        <template #before>
          <q-tabs
            v-model="tab"
            vertical
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab
              v-for="message in messages"
              :key="message.lang"
              :name="message.lang"
              :label="message.lang"
              :alert="!(message.title && message.content)"
              alert-icon="priority_high"
            />
          </q-tabs>
        </template>
        <template #after>
          <QForm ref="formRef" class="q-gutter-md">
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel
                v-for="message in messages"
                :key="message.lang"
                :name="message.lang"
              >
                <q-input
                  v-model="message.title"
                  outlined
                  :label="$t('messages.notifications.notification_title')"
                  :rules="titleRules"
                />
                <q-input
                  v-model="message.content"
                  outlined
                  type="textarea"
                  :label="$t('messages.notifications.notification_content')"
                  :rules="contentRules"
                />
                <q-input
                  v-model="message.link"
                  outlined
                  :label="$t('messages.notifications.notification_link')"
                />
              </q-tab-panel>
            </q-tab-panels>
          </QForm>
        </template>
      </q-splitter>
      <div class="row justify-end q-mr-md">
        <q-btn
          unelevated
          color="primary"
          :label="$t('messages.notifications.send_notificaton')"
          icon-right="send"
          @click="submitNotificationBroadcast"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref, unref } from 'vue';
import { QForm, useQuasar } from 'quasar';
import Joi from 'joi';

import { i18n } from 'boot/i18n';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import {
  Message,
  sendNotificationToEveryone,
} from 'src/flox/modules/notification/services/notification.service';
import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';

const $q = useQuasar();

const splitterModel: Ref<number> = ref(20);
const tab: Ref<string> = ref(i18n.global.locale.value);
const locales: ComputedRef<string[]> = computed(() => {
  return i18n.global.availableLocales;
});

const formRef: Ref<QForm | null> = ref(null);
const titleRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().required().min(5).max(60),
    i18n.global.t('messages.notifications.invalid_title')
  ),
];
const contentRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().required().min(20).max(500),
    i18n.global.t('messages.notifications.invalid_content')
  ),
];

const messages: Ref<Message[]> = ref(
  unref(locales).map((lang) => ({
    lang,
    title: '',
    content: '',
    link: '',
  }))
);

/**
 * Submits new notification to all users
 */
async function submitNotificationBroadcast(): Promise<void> {
  const form = formRef.value;
  if (!form) {
    return;
  }
  const formValid = await form.validate();
  const allFilledIn = messages.value.every((msg) => msg.title && msg.content);
  if (!(formValid && allFilledIn)) {
    showErrorNotification($q, i18n.global.t('errors.missing_attributes'));
    return;
  }
  await sendNotificationToEveryone(messages.value);
  showSuccessNotification($q, i18n.global.t('messages.notifications.sent'));
  messages.value = messages.value.map((msg) => ({
    ...msg,
    title: '',
    content: '',
    link: '',
  }));
  form.reset();
}
</script>
