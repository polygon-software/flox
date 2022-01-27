<template>
  <q-header class="row bg-black shadow-2 full-width">
    <q-toolbar class="full-width justify-between">
      <div class="row">
      <q-btn
        flat
        round
        dense
        icon="menu"
        @click="toggleDrawer"
      />
        <q-toolbar-title>
          Strategic Opportunity Investments
        </q-toolbar-title>
        <!-- Admin chip -->
        <q-chip
          v-if="admin"
          label="Admin"
          color="primary"
          text-color="white"
          :clickable="false"
          :ripple="false"
        />

        <!-- Company chip -->
        <div
          v-if="companyUuid"
        >
          <q-icon name="arrow_right" />
          <q-chip
            :label="companyName ?? $t('general.loading')"
            color="red"
            text-color="white"
            :clickable="false"
            :ripple="false"
          />
        </div>

        <!-- Employee chip -->
        <div
          v-if="employeeUuid"
        >
          <q-icon name="arrow_right" />
          <q-chip
            :label="employeeName ?? $t('general.loading')"
            color="orange"
            text-color="white"
            :clickable="false"
            :ripple="false"
          />
        </div>

        <!-- Bank chip -->
        <div
          v-if="bankUuid"
        >
          <q-icon name="arrow_right" />
          <q-chip
            :label="bankName ?? $t('general.loading')"
            color="red"
            text-color="white"
            :clickable="false"
            :ripple="false"
          />
        </div>
      </div>

      <q-btn-dropdown
        dropdown-icon="more_vert"
        auto-close
        no-icon-animation
        flat
        round
        dense
        @click="showOptions = !showOptions"
      >
        <div class="column">
          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.logout')"
            class="text-black"
            flat
            no-caps
            @click="logout"
          />

          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.change_password')"
            class="text-black"
            flat
            no-caps
            @click="changePassword"
          />
        </div>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import {computed, defineEmits, inject, onMounted, ref, watch} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {boolean} from 'joi';
import {useRoute} from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {COMPANY} from 'src/data/queries/COMPANY';
import {EMPLOYEE} from 'src/data/queries/EMPLOYEE';
import {BANK} from 'src/data/queries/BANK';
const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()
const route = useRoute()

// Company ID from route (if any), only relevant if going from SOIAdmin -> Company view
const companyUuid = ref(route.query.cid)

// Employee ID from route (if any), only relevant if going from SOIAdmin -> Company -> Employee view
const employeeUuid = ref(route.query.eid)

// Bank ID from route (if any), only relevant if going from SOIAdmin -> Bank view
const bankUuid = ref(route.query.bid)

const showDrawer = ref(true)
const emit = defineEmits(['toggle'])

const loggedIn = computed(() => {
  // Explicit type
  const result: boolean = $authStore.getters.getLoggedInStatus()
  return result;
})

const companyName = ref(null)
const employeeName = ref(null)
const bankName = ref(null)

/**
 * On mounted, get names of all needed entities
 */
onMounted(async () => {
  await getChipValues()
})

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  admin: {
    type: boolean,
    required: false,
    default: false,
  }
})

// On query update, update chips
watch(route, async () => {
  await getChipValues()
})

/**
 * Logs out the current authentication
 * @async
 * @returns {void}
 */
async function logout(): Promise<void>{
  await $authService?.logout();
  await $routerService?.routeTo(ROUTES.LOGIN)
}

/**
 * Updates the chip values
 * @returns {Promise<void>} - done
 */
async function getChipValues(){
  // Update from query
  companyUuid.value = route.query.cid
  employeeUuid.value = route.query.eid
  bankUuid.value = route.query.bid

  if(companyUuid.value){
    const companyQuery = await executeQuery(COMPANY, {uuid: companyUuid.value})
    companyName.value = companyQuery.data.company.company_name as string ?? null
  }
  if(employeeUuid.value){
    const employeeQuery = await executeQuery(EMPLOYEE, {uuid: employeeUuid.value})
    const firstName = employeeQuery.data.getEmployee.first_name as string ?? null
    const lastName = employeeQuery.data.getEmployee.last_name as string ?? null
    employeeName.value = firstName && lastName ? `${firstName} ${lastName}` : null
  }
  if(bankUuid.value){
    const bankQuery = await executeQuery(BANK, {uuid: bankUuid.value})
    bankName.value = bankQuery.data.getBank.name as string ?? null
  }
}

/**
 * Triggers a password change for the currently logged in user
 * @returns {void}
 */
function changePassword(): void {
  $authService?.showChangePasswordDialog()
}

/**
 * Toggles the left-hand drawer menu
 * @returns {void}
 */
function toggleDrawer(): void {
  showDrawer.value = !showDrawer.value
  emit('toggle', showDrawer)
}

</script>
