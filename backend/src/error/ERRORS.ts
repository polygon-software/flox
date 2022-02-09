/**
 * This file contains all backend error messages
 */

export const ERRORS = {
  file_expected: 'File expected on this endpoint',
  file_missing_url: 'File is missing URL',
  no_valid_file: 'No valid file sent',
  no_valid_company: 'No valid company found, the link you used may be invalid.',
  no_valid_association: 'No valid association found',
  no_user_found: 'Cognito Id of request could not be resolved to User',
  no_dossier_found: 'Dossier does not exist',
  invalid_date_input: 'Start and end date must be valid in YYYY-MM-DD format',
  invalid_zip_code: 'Invalid Zip Code',
  missing_query_parameters: 'Required query parameters are missing',
  missing_database_data: 'Missing required data in database',
  invalid_user_type: 'Invalid User Type specified',
};
