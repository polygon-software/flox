<template>
  <q-page class="flex">
    <!-- General Info -->
    <q-card
      class="q-pa-md q-ma-md"
      flat
      style="width: 100%; border-radius: 20px; border: 1px solid black"
    >
      <p>General</p>
      <div class="row full-width">
        <!-- Left column -->
        <div class="column col-6 q-pa-md">
          <!-- Name -->
          <q-input
            label="Product Name"
            outlined
            dense
          />
          <!-- Description -->
          <q-input
            label="Product Description"
            outlined
            dense
          />

        </div>
        <!-- Right column -->
        <div class="column col-6 q-pa-md">
          <!-- Brand & category row -->
          <div class="row">
            <q-input
              label="Brand"
              outlined
              dense
            />
            <q-input
              label="Category"
              outlined
              dense
            />
          </div>

          <!-- Start date -->
          <q-input
            label="Start"
            type="date"
            outlined
            dense
          />

          <!-- End date -->
          <q-input
            label="End"
            type="date"
            outlined
            dense
          />

          <!-- Value & currency -->
          <div class="row">
            <q-input
              label="Value"
              type="number"
              outlined
              dense
            />
            <p>TODO currency</p>
          </div>

        </div>
      </div>

    </q-card>

    <!-- Images etc. TODO -->
    <div class="row full-width q-pa-md">
      <q-card
        class="q-pa-md column col-6"
        flat
        style="border-radius: 20px; border: 1px solid black"
      >
        <p>Images</p>
<!--        TODO -->
        <PictureUpload
        />
      </q-card>

      <q-card
        class="q-pa-md column col-6"
        flat
        style="border-radius: 20px; border: 1px solid black"
      >
        <p>TODO</p>
      </q-card>
    </div>

    <!-- Submit -->
    <div class="row full-width justify-end">
      <q-btn
        color="primary"
        :label="$t('submit')"
        @click="onSubmit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {reactive} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation} from 'src/helpers/data-helpers';

const form = reactive({
  title: null,
  description: null,
  pictures: [],
  value: null,
})

/**
 * TODO
 */
async function onSubmit(){
  console.log('OnSubmit')


  await executeMutation(
    CREATE_PRODUCT,
    {
      company_name: values.company_data.company_name,
      first_name: values.full_name.first_name,
      last_name: values.full_name.last_name,
      language: values.language,
      uid: values.company_data.uid,
      domicile_address: domicile_address,
      correspondence_address: correspondence_address,
      phone: values.phone_number,
      email: values.email,
      branch_structure: values.company_data.branch_structure
    }
  )
  // // Push to success page
  // setTimeout(function() {$routerService?.routeTo(ROUTES.LOGIN)}, 5000);
  // await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>
