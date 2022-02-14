import gql from 'graphql-tag';

export const SOI_EMPLOYEES = {
  query: gql`
    query allSoiEmployees{
      allSoiEmployees{
        uuid
        first_name
        last_name
        email
        phone
        created_at
        banned_at
        __typename
      }
    }
  `,
  tables: ['soi_employee'],
  cacheLocation: 'allSoiEmployees'
}

const SOI_EMPLOYEE_QUERIES = [
  SOI_EMPLOYEES
]


export default SOI_EMPLOYEE_QUERIES
