/**
 * Fetch bearer token to allow file upload
 * @return {string} token - The generated token
 */
export function getBearerToken() {
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
    iter++;
  } while (res);
  if (!token) {
    throw new Error('Authentication Failure');
  }
  return `Bearer ${token}`;
}
