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
              v-for="locale in locales"
              :key="locale"
              :name="locale"
              :label="locale"
              :alert="
                !(
                  notification[`${locale}Title`] &&
                  notification[`${locale}Content`]
                )
              "
              alert-icon="priority_high"
            />
          </q-tabs>
        </template>
        <template #after>
          <q-form ref="formRef" class="q-gutter-md">
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel
                v-for="locale in locales"
                :key="locale"
                :name="locale"
              >
                <q-input
                  v-model="notification[`${locale}Title`]"
                  outlined
                  :label="$t('notification.notification_title')"
                  :rules="titleRules"
                />
                <q-input
                  v-model="notification[`${locale}Content`]"
                  outlined
                  type="textarea"
                  :label="$t('notification.notification_content')"
                  :rules="contentRules"
                />
              </q-tab-panel>
            </q-tab-panels>
          </q-form>
        </template>
      </q-splitter>
      <div class="row justify-end q-mr-md">
        <q-btn
          unelevated
          color="primary"
          :label="$t('notification.send_notificaton')"
          icon-right="send"
          @click="submitNotificationBroadcast"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue';
import { QForm, useQuasar } from 'quasar';
import Joi from 'joi';

import { i18n } from 'boot/i18n';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import {
  NewNotification,
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
    i18n.global.t('notification.invalid_title')
  ),
];
const contentRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().required().min(20).max(500),
    i18n.global.t('notification.invalid_content')
  ),
];

const notification: Ref<NewNotification> = ref({
  deTitle: '',
  deContent: '',
  enTitle: '',
  enContent: '',
  link: '',
});

/**
 * Submits new notification to all users
 */
async function submitNotificationBroadcast(): Promise<void> {
  const form = formRef.value;
  if (!form) {
    return;
  }
  const allValid = await form.validate();
  const n = notification.value;
  const allFilledIn = n.deTitle && n.deContent && n.enTitle && n.enContent;
  if (!(allValid && allFilledIn)) {
    showErrorNotification($q, i18n.global.t('errors.missing_attributes'));
    return;
  }
  await sendNotificationToEveryone(notification.value);
  showSuccessNotification($q, i18n.global.t('notification.sent'));
  notification.value = {
    deTitle: '',
    deContent: '',
    enTitle: '',
    enContent: '',
    link: '',
  };
  form.reset();
}
</script>

