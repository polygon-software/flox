<template>
  <q-card
    class="full-width q-pa-sm"
    style="margin-bottom: 20px"
    flat
  >
    <q-item-label v-if="company_readable_id" caption>
      {{ $t('employee_dashboard.organisation_id')}}: {{ company_readable_id }}
    </q-item-label>
    <q-item-label v-if="employee_readable_id" caption>
      {{ $t('employee_dashboard.employee_id')}}: {{ employee_readable_id }}
    </q-item-label>
    <q-item-label v-if="other" caption>
      {{ $t('employee_dashboard.role')}}: {{ other }}
    </q-item-label>
  </q-card>
</template>

<script setup lang="ts">
import {executeQuery} from 'src/helpers/data-helpers';
import {COMPANY, MY_COMPANY, MY_EMPLOYEE, MY_USER} from 'src/data/queries/QUERIES';
import {ROLE} from 'src/data/ENUM/ENUM';
import {User} from 'src/data/types/User';
import {ref} from 'vue';


let employee_readable_id = ref('')
let company_readable_id = ref('')
let other = ref('')
void executeQuery(MY_USER).then((user_resp)=>{
  if(!user_resp.data){
    other.value = 'Unauthenticated'
    return
  }
  const user = user_resp.data[MY_USER.cacheLocation]  as User
  if(user.role === ROLE.EMPLOYEE){
    void executeQuery(MY_EMPLOYEE).then((employee_resp)=>{
      const employee = employee_resp.data[MY_EMPLOYEE.cacheLocation] as Record<string, unknown >;
      employee_readable_id.value = employee.readable_id as string
      void executeQuery(COMPANY, {uuid:employee.company_id}).then((company_resp)=>{
        const company = company_resp.data[MY_COMPANY.cacheLocation] as Record<string, unknown >;
        company_readable_id.value = company.readable_id as string
      })

    })
  } else if(user.role === ROLE.COMPANY){
    void executeQuery(MY_COMPANY).then((company_resp)=>{
      const company = company_resp.data[MY_COMPANY.cacheLocation] as Record<string, unknown >;
      company_readable_id.value = company.readable_id as string
    })
  } else {
    other.value = user.role || 'Unauthenticated'
  }
})

// const employee = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>
</script>
