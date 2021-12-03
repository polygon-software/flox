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
import {reactive, Ref, ref} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_PRODUCT} from 'src/data/mutations/PRODUCT';

// Inputs for CREATE_PRODUCT mutation
const input = reactive({
  title: null,
  description: null,
  start: null,
  end: null,
  value: null,
})

// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<File[]> = ref([])

  /**
 * TODO
 */
async function onSubmit(){
  console.log('OnSubmit')

  // Create on database
  const newProduct = await executeMutation(
    CREATE_PRODUCT,
    {
      createProductInput: input
    }
  )
  // // Push to success page
  // setTimeout(function() {$routerService?.routeTo(ROUTES.LOGIN)}, 5000);
  // await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>
