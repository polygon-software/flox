<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create new Access Group</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-form ref="creationForm" class="q-gutter-md">
          <p>
            Create a new access group by providing a group name and specifying
            users that belong to this group. You can always add/remove users
            later on.
          </p>
          <q-input
            v-model="newGroupName"
            outlined
            dense
            label="New Group Name"
            :rules="nameRules"
          />
          <LazySearchField
            v-model="selectedUsers"
            :query="SEARCH_USERS"
            options-label="username"
            :select-props="{ label: 'Select Users' }"
          />
        </q-form>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn unelevated label="Cancel" @click="onDialogCancel" />
        <q-btn
          unelevated
          color="primary"
          label="Create"
          icon-right="add"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { QForm, useDialogPluginComponent } from 'quasar';
import Joi from 'joi';

import LazySearchField from 'components/forms/LazySearchField.vue';
import { SEARCH_USERS } from 'src/flox/modules/auth/user.query';
import { createUserGroup } from 'src/flox/modules/access-control/services/access-control.service';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import {
  joiSchemaToValidationRule,
  ValidationRule,
} from 'src/tools/validation.tool';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const newGroupName: Ref<string> = ref('');
const selectedUsers: Ref<UserEntity[]> = ref([]);
const creationForm: Ref<QForm | null> = ref(null);

const nameRules: ValidationRule[] = [
  joiSchemaToValidationRule(
    Joi.string().min(5).max(20),
    'access_control.invalid_group_name'
  ),
];

async function onOKClick() {
  if (creationForm.value) {
    const valid = await creationForm.value.validate();
    if (valid) {
      await createUserGroup(
        newGroupName.value,
        selectedUsers.value.map((user) => user.uuid)
      );
      onDialogOK();
    }
  }
}
</script>

<style scoped></style>
