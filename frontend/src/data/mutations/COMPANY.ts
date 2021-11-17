import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_COMPANY = {
  mutation: gql`
    mutation createCompany($name: String!, $age: Int!){
      createCompany (createCompanyInput: {company_name: $company_name,person_name: $person_name, language: $language, uid: $uid, domicile_address: $domicile_address, correspondence_address: $correspondence_address, phone: $phone, email: $email, branch_structure: $branch_structure}) {
        uuid
        company_name
        person_name
        language,
        uid,
        domicile_address,
        correspondence_address,
        phone,
        email,
        branch_structure,
        __typename
      }
    }`,
  tables: ['company'],
  type: MutationTypes.CREATE,
  cacheLocation: 'create'
}
