<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('access_control.create_group') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>

      <q-card-section>
        <QForm ref="accessGroupCreationForm" class="q-gutter-md">
          <p>
            {{ $t('access_control.create_description') }}
          </p>
          <q-input
            v-model="accessGroupNameInput"
            outlined
            dense
            :label="$t('access_control.group_name_label')"
            :rules="nameRules"
          />
          <LazySearchField
            v-model="selectedUsersForAccessGroup"
            :query="SEARCH_USERS"
            options-label="username"
            :select-props="{ label: $t('access_control.select_users') }"
          />
        </QForm>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          unelevated
          :label="$t('general.cancel')"
          @click="onDialogCancel"
        />
        <q-btn
          unelevated
          color="primary"
          :label="$t('general.create')"
          icon-right="add"
          @click="createAccessGroup"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { QForm, useDialogPluginComponent } from 'quasar';
import Joi from 'joi';

import LazySearchField from 'src/flox/modules/form/components/LazySearchField.vue';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { createUserGroup } from 'src/flox/modules/access-control/services/access-control.service';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';
import { i18n } from 'boot/i18n';

// eslint-disable-next-line vue/define-emits-declaration
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const accessGroupNameInput: Ref<string> = ref('');
const selectedUsersForAccessGroup: Ref<UserEntity[]> = ref([]);
const accessGroupCreationForm: Ref<QForm | null> = ref(null);

const nameRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().min(5).max(20),
    i18n.global.t('access_control.invalid_group_name')
  ),
];

/**
 * Creates user access group with selected users and closes popup
 */
async function createAccessGroup(): Promise<void> {
  if (accessGroupCreationForm.value) {
    const valid = await accessGroupCreationForm.value.validate();
    if (valid) {
      await createUserGroup(
        accessGroupNameInput.value,
        selectedUsersForAccessGroup.value.map((user) => user.uuid)
      );
      onDialogOK();
    }
  }
}
</script>
