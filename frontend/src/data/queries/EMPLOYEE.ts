import gql from 'graphql-tag';

export const ALL_EMPLOYEES = {
  query: gql`
    query allEmployees{
      allEmployees{
        uuid
        first_name
        last_name
        function
        email
        phone
        __typename
      }
    }
  `,
  tables: ['employee'],
  cacheLocation: 'allEmployees'
}

export const MY_EMPLOYEES = {
  query: gql`
    query getMyEmployees{
      getMyEmployees{
        uuid
        first_name
        last_name
        function
        email
        phone
        __typename
      }
    }
  `,
  tables: ['employee'],
  cacheLocation: 'getMyEmployees'
}

export const MY_EMPLOYEE = {
  query: gql`
    query getMyEmployee{
      getMyEmployee{
        uuid
        first_name
        last_name
        readable_id
        email
        company{
          __typename
          uuid
          readable_id
        }
        __typename
      }
    }
  `,
  tables: ['employee'],
  cacheLocation: 'getMyEmployee'
}

const EMPLOYEE_QUERIES = [
  ALL_EMPLOYEES,
  MY_EMPLOYEE,
  MY_EMPLOYEES
]


export default EMPLOYEE_QUERIES