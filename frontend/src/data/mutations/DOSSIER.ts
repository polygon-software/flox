import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

/**
 * todo: after the table exists, compare it and change it like it is in the table
 */
export const SET_DOSSIER_STATUS = {
  mutation: gql`
    mutation updateDossierStatus($company_name: String!, $first_name: String!, $last_name: String!, $language: String!, $uid: String, $domicile_address: CreateAddressInput!, $correspondence_address: CreateAddressInput!, $phone: String!, $email: String!, $branch_structure: Boolean!){
      updateDossierStatus (createDossierStatus: {company_name: $company_name, first_name: $first_name, last_name: $last_name, language: $language, uid: $uid, domicile_address: $domicile_address, correspondence_address: $correspondence_address, phone: $phone, email: $email, branch_structure: $branch_structure}) {
        uuid
        status
        __typename
      }
    }`,
  tables: ['dossier'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
