import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_COMPANY = {
  mutation: gql`
    mutation createCompany($company_name: String!, $person_name: String!, $language: String!, $uid: String, $domicile_address: CreateAddressInput!, $correspondence_address: CreateAddressInput!, $phone: String!, $email: String!, $branch_structure: Boolean!){
      createCompany (createCompanyInput: {company_name: $company_name,person_name: $person_name, language: $language, uid: $uid, domicile_address: $domicile_address, correspondence_address: $correspondence_address, phone: $phone, email: $email, branch_structure: $branch_structure}) {
        uuid
        company_name
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.CREATE,
  cacheLocation: 'create'
}
