<template>
  <q-table v-if="result && result.users"
    title="List of users"
    :rows="result.users"
    :columns="columns"
    row-key="id"
  />
  <q-spinner v-else />
</template>

<script>
import { useQuery } from '@vue/apollo-composable'
import gql from "graphql-tag";

export default {
  name: "TestTable",

  data () {
    return {
      columns: [
        { name: 'id', align: 'center', label: 'User ID', field: 'id', sortable: false },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'age', align: 'center', label: 'Age (years)', field: 'age', sortable: true },
      ],
    }
  },

  setup () {
    // Execute Test query to get some users
    const { result } = useQuery(gql`
      query{
          users(userIds:["2783e30c-e76c-418c-ab8a-f24db932dee5","282a5692-d4d1-436f-84e2-04d41093301a","75ed1bd1-c31c-4deb-9be4-8b4fa31050e0","78028ba6-8034-4358-bc48-a381fa157e8e","b0477f21-3ba8-43eb-8f03-84b0b88d1916","d5440ec0-aa52-4eaa-bdac-93f2e3f6d91b","fe2b00a2-a2c8-42aa-a6cc-cd9d15c17dde",
        ]){
          id
          name
          age
        }
      }
    `)

    return {
      result
    }
  },
}
</script>

<style scoped>

</style>
