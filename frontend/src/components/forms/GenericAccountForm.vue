<template>
  <q-form
    ref="formRef"
    greedy
    class="q-gutter-md"
  >
    <div class="q-pa-md">
      <q-card-section
        v-for="(field,index) in form.pages.value[0].fields"
        :key="field.key"
      >
        <p>{{ field.attributes.label }}</p>
        <div style="display: flex">
          <component
            :is="field.component"
            v-model="form.values.value[field.key]"
            v-bind="field.attributes"
            style="width: 250px; padding: 0; margin-right: 10px"
            :initial-value="form.values.value[field.key]? form.values.value[field.key] : emailUsername[index]"
            :outlined="editing[index]"
            :borderless="!editing[index]"
            :disable="!editing[index]"
            label=""
            @change="(newValue) => form.updateValue(field.key, newValue)"
            @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
          />
          <q-btn
            style="width: 165px; height: 20px"
            color="primary"
            :label="!editing[index] ? editLabel : saveLabel"
            unelevated
            @click="onSave(index)"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <p>{{ $t('account_data.password')}}</p>
        <div style="display: flex">
          <q-field borderless stack-label style="width: 250px; padding: 0; margin-right: 10px">
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">*******</div>
            </template>
          </q-field>
          <q-btn
            style="width: 165px; height: 20px"
            color="primary"
            :label="$t('account_data.change_password')"
            unelevated
            @click="onChange"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          :label="!loading ? finishLabel : loadingLabel"
          :disable="loading"
          unelevated
          @click="onSubmit"
        >
          <q-inner-loading
            :showing="loading"
          />
        </q-btn>
      </q-card-actions>
    </div>
  </q-form>
</template>

<script setup lang="ts">
/**
 * This component defines a generic form that can have a single or multiple pages.
 * It takes the following properties:
 * @param {Object[]} pages - the pages to show, each containing fields, label and key
 * @param {string} [finishLabel] - the label to show on the 'finish' button (will default to 'Finish' in correct language)
 * @param {boolean} [loading] - loading status to show on the finish button
 */
import {defineEmits, defineProps, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {QForm} from 'quasar';

const emit = defineEmits(['submit'])
const formRef: Ref<QForm|null> = ref(null)
const props = defineProps({
  finishLabel: {
    required: false,
    type: String,
    default: i18n.global.t('buttons.finish'),
  },
  loadingLabel: {
    required: false,
    type: String,
    default: i18n.global.t('status.loading') + '...',
  },
  pages: {
    required: true,
    type: Array,
    default: () => [],
  },
  loading: {
    required: false,
    type: Boolean,
    default: false
  },
  editLabel: {
    required: false,
    type: String,
    default: i18n.global.t('buttons.edit'),
  },
  saveLabel: {
    required: false,
    type: String,
    default: i18n.global.t('buttons.save'),
  },
  emailUsername: {
    required: false,
    type: Array,
    default: () => [],
  },
})

// Get copy of prop form
const form: Form = new Form(props.pages as Record<string, unknown>[])
/**
 * Validates and, if valid, submits the form with all entered values
 * @returns {Promise<void>} - done
 */
async function onSubmit(){
  const isValid = await formRef.value?.validate()
  if(isValid){
    emit('submit', form.values.value)
  }
}

const editing = ref([false, false, false])
/**
 * Saves the entered values
 * @param {number} index - index
 * @returns {void}
 */
function onSave(index: number){
  editing.value[index] = !editing.value[index];
}
</script>
