/**
 * Fetch bearer token to allow file upload
 *
 * @returns {string} token - The user's Cognito ID token
 */
// eslint-disable-next-line import/prefer-default-export
export function getBearerToken(): string {
  let iter = 0;
  let res: string | null = '';
  let token: string | null = '';
  do {
    res = localStorage.key(iter);
    if (
      res?.endsWith('.idToken') &&
      res?.startsWith('CognitoIdentityServiceProvider.')
    ) {
      token = localStorage.getItem(res);
      break;
    }
    iter += 1;
  } while (res);
  if (!token) {
    throw new Error('No Cognito bearer token found in localStorage');
  }
  return `Bearer ${token}`;
}
