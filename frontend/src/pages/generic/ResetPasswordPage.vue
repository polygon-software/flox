<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">

      <q-card-section
        class="col"
      >
        <div
          class="column q-pa-sm flex-center"
          style="width: 600px; text-align: center;"
        >
          <h5 class="q-ma-none" style="width: 300px; align-self: center; margin-bottom: 20px;">
            {{ $t('authentication.reset_password') }}
          </h5>
          <p class="q-ma-none" style="width: 300px; align-self: center; margin-bottom: 20px;">
            {{ $t('authentication.reset_password_text') }}
          </p>
          <q-form
            class="q-gutter-md"
            style="width: 300px; align-self: center"
            @submit="onReset"
          >
            <component
              :is="field.component"
              v-for="field in fields"
              :key="field.key"
              v-bind="field.attributes"
              v-model="form.values.value[field.key]"
              @change="(newValue) => form.updateValue(field.key, newValue)"
            />
          </q-form>
          <div style="display: flex; flex-direction: row; margin-top: 20px;">
            <q-btn
              no-caps
              :label="$t('buttons.cancel')"
              class="text-primary"
              flat
              @click="onCancel"
            />
            <q-btn
              color="primary"
              :label="$t('authentication.reset_password')"
              @click="onReset"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {inject} from 'vue'
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')


const fields = [FIELDS.EMAIL]

const form = new Form()
form.pages.value = [
  {
    key: 'reset',
    label: 'Reset',
    fields: fields
  }
]

/**
 * Routes to the Reset Password 2 Page
 * @returns {Promise<void>} - done
 */
async function onReset(): Promise<void>{
  await $routerService?.routeTo(ROUTES.RESET_PASSWORD2)
}


/**
 * Routes to the Login Page
 * @returns {Promise<void>} - done
 */
async function onCancel(): Promise<void>{
  await $routerService?.routeTo(ROUTES.LOGIN)
}

</script>
