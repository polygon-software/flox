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
            v-model="input.title"
            label="Product Name"
            outlined
            dense
          />
          <!-- Description -->
          <q-input
            v-model="input.description"
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
            v-model="input.start"
            label="Start"
            type="date"
            outlined
            dense
          />

          <!-- End date -->
          <q-input
            v-model="input.end"
            label="End"
            type="date"
            outlined
            dense
          />

          <!-- Value & currency -->
          <div class="row">
            <q-input
              v-model="input.value"
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
          @change="onPictureChange"
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
import axios from 'axios';
import {FetchResult} from '@apollo/client';

// Inputs for CREATE_PRODUCT mutation
const input = reactive({
  title: null,
  description: null,
  start: null,
  end: null,
  value: null,
})

// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<Array<Ref<File>>> = ref([])

/**
 * TODO
 * @param newPictures
 */
function onPictureChange(newPictures: Ref<File>[]){
  pictures.value = newPictures
}

  /**
 * TODO
 */
async function onSubmit(){
  console.log('OnSubmit')


  // TODO verify all attrs, at least 1 image
  if(!input.value) throw new Error('thats illegal')

  // Create on database
  const mutationResult = await executeMutation(
    CREATE_PRODUCT,
    {
      createProductInput: {
        ...input,
        value: Number.parseInt(input.value) // Convert 'value' to int
      }
    }
  )

  if(!mutationResult){
    throw new Error('Product creation failed')
  }

  // Prepare variables for image upload TODO
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const newProductId: string = mutationResult.data.createProduct.uuid
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const headers = { 'Content-Type': 'multipart/form-data' }

  console.log('New prod:', newProductId)

  // Upload all images
  for(const picture of pictures.value) {
    const formData = new FormData();
    if (picture.value) {
      // Convert to Blob and append
      const blob = picture.value as Blob
      formData.append('file', blob)

      console.log('POST file') // TODO remove

      await axios({
        method: 'post',
        url: `${baseUrl}/uploadPublicFile?productId=${newProductId}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
    }
  }

  console.log('Done!')

  // // Push to success page
  // setTimeout(function() {$routerService?.routeTo(ROUTES.LOGIN)}, 5000);
  // await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>
