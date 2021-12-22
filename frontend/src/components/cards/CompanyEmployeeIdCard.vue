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
import {MY_COMPANY, MY_EMPLOYEE, MY_USER} from 'src/data/queries/QUERIES';
import {ROLE} from 'src/data/ENUM/ENUM';
import {User} from 'src/data/types/User';
import {ref} from 'vue';
import {i18n} from 'boot/i18n';


const employeeReadableId = ref('')
const companyReadableId = ref('')
const other = ref('')
const errorString = i18n.global.t('authentication.unauthenticated')

executeQuery(MY_USER).then((userResp)=>{
  if(!userResp.data){
    other.value = errorString
    return
  }
  const user = userResp.data[MY_USER.cacheLocation]  as User
  console.log(user)
  if(user.role === ROLE.EMPLOYEE){
    executeQuery(MY_EMPLOYEE).then((employeeResp)=>{
      const employee = employeeResp.data[MY_EMPLOYEE.cacheLocation] as Record<string, unknown >;
      employeeReadableId.value = employee.readable_id as string
      const company = employee.company as Record<string, string >
      companyReadableId.value = company.readable_id;
    }).catch((error)=>{
      other.value = user.role || errorString
      console.error(error)
    })
  } else if(user.role === ROLE.COMPANY){
    executeQuery(MY_COMPANY).then((companyResp)=>{
      const company = companyResp.data[MY_COMPANY.cacheLocation] as Record<string, unknown >;
      companyReadableId.value = company.readable_id as string
    }).catch((error)=>{
      other.value = user.role || errorString
      console.error(error)
    })
  } else {
    other.value = user.role || errorString
  }
}).catch((error)=>{
  other.value = errorString
  console.error(error)
})
</script>
