<template>
  <q-card
    class="full-width q-pa-sm"
    style="margin-bottom: 20px"
    flat
  >
    <q-item-label v-if="companyReadableId" caption>
      {{ $t('employee_dashboard.organisation_id') }}: {{ companyReadableId }}
    </q-item-label>
    <q-item-label v-if="employeeReadableId" caption>
      {{ $t('employee_dashboard.employee_id') }}: {{ employeeReadableId }}
    </q-item-label>
    <q-item-label v-if="other" caption>
      {{ $t('employee_dashboard.role')}}: {{ other }}
    </q-item-label>
  </q-card>
</template>

<script setup lang="ts">
import {executeQuery} from 'src/helpers/data-helpers';
import {ROLE} from 'src/data/ENUM/ENUM';
import {User} from 'src/data/types/User';
import {onMounted, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {MY_USER} from 'src/data/queries/USER';
import {EMPLOYEE, MY_EMPLOYEE} from 'src/data/queries/EMPLOYEE';
import {useRoute} from 'vue-router';

const route = useRoute()

// Employee ID from route (if any), only relevant if going from SOIAdmin -> Company -> Employee or Company -> Employee
const employeeUuid = route.query.eid

const employeeReadableId = ref('')
const companyReadableId = ref('')
const other = ref('')
const errorString = i18n.global.t('authentication.unauthenticated')

onMounted(async () => {
  const myUser = await executeQuery(MY_USER)

  if (!myUser.data) {
    other.value = errorString
    return
  }

  const user = myUser.data[MY_USER.cacheLocation] as User
  // Employee: show only employee ID
  if(user.role === ROLE.EMPLOYEE){
    executeQuery(MY_EMPLOYEE).then((employeeResp) => {
      const employee = employeeResp.data[MY_EMPLOYEE.cacheLocation] as Record<string, unknown>;
      employeeReadableId.value = employee.readable_id as string
      const company = employee.company as Record<string, string>
      companyReadableId.value = company.readable_id;
    }).catch((error) => {
      other.value = user.role || errorString
      console.error(error)
    })
  } else if(employeeUuid){
    // Admin or company: Fetch employee from URL (if given)
    executeQuery(EMPLOYEE, {uuid: employeeUuid}).then((employeeResp) => {
      const employee = employeeResp.data[EMPLOYEE.cacheLocation] as Record<string, unknown>;
      employeeReadableId.value = employee.readable_id as string
      const company = employee.company as Record<string, string>
      companyReadableId.value = company.readable_id;
    }).catch((error) => {
      other.value = user.role || errorString
      console.error(error)
    })
  } else {
    other.value = errorString
  }
})
</script>
