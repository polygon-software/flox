import gql from 'graphql-tag';

export const MY_DOSSIERS = {
  query: gql`
    query getMyDossiers($employeeUuid: String){
      getMyDossiers(employeeUuid: $employeeUuid){
        uuid
        status
        non_arrangeable
        created_at
        last_modified_at
        first_name
        last_name
        email
        phone
        birthdate
        has_amortisation
        direct_amortisation
        amortisation_amount
        has_building_lease
        has_renovation
        renovation_price
        renovation_year
        readable_id
        purchase_date
        purchase_price
        property_type
        market_value_estimation
        mortgage_amount
        prosecutions
        loss_certificates
        amortisation_amount
        affordability
        eligible_income
        total_costs
        value_estimate_low
        value_estimate_high
        enfeoffment_estimate_low
        enfeoffment_estimate_high
        partition_amounts
        partition_dates
        assets
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        employee {
          uuid
          email
          __typename
        }
        documents{
          uuid
          key
          file_type
          __typename
        }
        final_document{
          uuid
          key
          file_type
          __typename
        }
        offers{
          __typename
          uuid
          status
          documents{
            uuid
            key
            __typename
          }
          bank {
            uuid
            name
            abbreviation
            __typename
          }
          status
        }
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getMyDossiers'
}

export const REJECTED_DOSSIERS = {
  query: gql`
    query{
      getRejectedDossiers{
        uuid
        status
        non_arrangeable
        created_at
        first_name
        last_name
        email
        phone
        birthdate
        has_amortisation
        direct_amortisation
        amortisation_amount
        has_building_lease
        has_renovation
        renovation_price
        renovation_year
        readable_id
        purchase_date
        purchase_price
        property_type
        market_value_estimation
        mortgage_amount
        prosecutions
        loss_certificates
        amortisation_amount
        affordability
        eligible_income
        total_costs
        value_estimate_low
        value_estimate_high
        enfeoffment_estimate_low
        enfeoffment_estimate_high
        assets
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        employee {
          uuid
          email
          __typename
        }
        documents{
          uuid
          file_type
          key
          __typename
        }
        final_document{
          uuid
          file_type
          key
          __typename
        }
        offers{
          __typename
          uuid
          status
          bank {
            uuid
            name
            abbreviation
            __typename
          }
        }
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getRejectedDossiers'
}

export const DOSSIERS_BANK = {
  query: gql`
    query allDossiersBank($bankUuid: String) {
      allDossiersBank(bankUuid: $bankUuid){
        uuid
        status
        non_arrangeable
        created_at
        has_amortisation
        direct_amortisation
        amortisation_amount
        has_building_lease
        has_renovation
        renovation_price
        renovation_year
        readable_id
        purchase_date
        purchase_price
        property_type
        market_value_estimation
        mortgage_amount
        prosecutions
        loss_certificates
        amortisation_amount
        affordability
        eligible_income
        total_costs
        value_estimate_low
        value_estimate_high
        enfeoffment_estimate_low
        enfeoffment_estimate_high
        partition_dates
        partition_amounts
        assets
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        documents{
          uuid
          key
          file_type
          __typename
        }
        final_document{
          uuid
          key
          file_type
          __typename
        }
        offers{
          __typename
          uuid
          status
          bank {
            uuid
            __typename
          }
          dossier {
            uuid
            __typename
          }
        }
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'allDossiersBank'
}

export const GET_DOSSIER = {
  query: gql`
    query getDossier($uuid: ID!) {
      getDossier(getDossierInput: {uuid: $uuid}) {
        uuid
        status
        non_arrangeable
        created_at
        first_name
        last_name
        email
        phone
        birthdate
        has_amortisation
        direct_amortisation
        amortisation_amount
        has_building_lease
        has_renovation
        renovation_price
        renovation_year
        readable_id
        purchase_date
        purchase_price
        property_type
        market_value_estimation
        mortgage_amount
        prosecutions
        loss_certificates
        amortisation_amount
        affordability
        eligible_income
        total_costs
        value_estimate_low
        value_estimate_high
        enfeoffment_estimate_low
        enfeoffment_estimate_high
        partition_dates
        partition_amounts
        assets
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        employee {
          uuid
          email
          __typename
        }
        documents{
          uuid
          key
          file_type
          __typename
        }
        final_document{
          uuid
          key
          file_type
          __typename
        }
        offers{
          __typename
          uuid
          status
        }
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getDossier'
}

const DOSSIER_QUERIES = [
  MY_DOSSIERS,
  REJECTED_DOSSIERS,
  DOSSIERS_BANK,
  GET_DOSSIER
]


export default DOSSIER_QUERIES