<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card
      class="q-pa-lg q-pt-xl"
      :style="`${DEFAULT_CARD_STYLE}; width: 400px; min-height: 250px; overflow: hidden`"
    >
      <q-form
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="onSubmit"
      >
        <h6 class="text-center">
          {{ $t('authentication.change_password') }}
        </h6>
        <LabelWrapper :label="$t('authentication.old_password')">
          <q-input
            v-model="passwordOld"
            outlined
            :type="isOldPwd ? 'password' : 'text'"
            dense
          >
            <template #append>
              <q-icon
                :name="isOldPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isOldPwd = !isOldPwd"
              />
            </template>
          </q-input>
        </LabelWrapper>
        <LabelWrapper :label="$t('authentication.new_password')">
          <q-tooltip :offset="[0, -15]">
            {{ $t('authentication.password_rule') }}
          </q-tooltip>
          <q-input
            v-model="password"
            outlined
            dense
            :type="isNewPwd ? 'password' : 'text'"
            :rules="[
              (val) =>
                PASSWORD_REGEX.test(val) || $t('errors.invalid_password'),
            ]"
          >
            <template #append>
              <q-icon
                :name="isNewPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isNewPwd = !isNewPwd"
              />
            </template>
          </q-input>
        </LabelWrapper>
        <LabelWrapper :label="$t('authentication.new_password_repeat')">
          <q-input
            v-model="passwordRep"
            outlined
            dense
            :type="isNewRepeatPwd ? 'password' : 'text'"
            :rules="[
              (val) => val === password || $t('errors.non_matching_password'),
            ]"
          >
            <template #append>
              <q-icon
                :name="isNewRepeatPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isNewRepeatPwd = !isNewRepeatPwd"
              />
            </template>
          </q-input>
        </LabelWrapper>
        <q-card-actions class="justify-between">
          <q-btn
            :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
            :style="`${DEFAULT_BUTTON_STYLE}; width: 150px;`"
            :label="$t('buttons.confirm')"
            :disable="password !== passwordRep"
            type="submit"
          />
          <q-btn
            :class="`${ALTERNATE_BUTTON_CLASS} q-my-md`"
            :style="`${DEFAULT_BUTTON_STYLE}; width: 150px;`"
            :label="$t('buttons.cancel')"
            @click="onDialogHide"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

import {
  ALTERNATE_BUTTON_CLASS,
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_CARD_STYLE,
} from 'src/css/defaultStyles';

import { PASSWORD_REGEX } from '../../../form/data/REGEX';
import LabelWrapper from '../../../form/components/fields/general/wrappers/LabelWrapper.vue';

const passwordOld = ref('');
const password = ref('');
const passwordRep = ref('');
const isOldPwd = ref(true);
const isNewPwd = ref(true);
const isNewRepeatPwd = ref(true);

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
function onSubmit(): void {
  onDialogOK({
    passwordNew: password.value,
  });
}
</script>
