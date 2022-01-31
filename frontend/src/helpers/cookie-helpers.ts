import {Cookies} from 'quasar';

/**
 * This file contains all cookie-related helper functions
 */


/**
 * Persists a given payload to one or multiple cookies
 * @param {string} category - sub-category to store the cookie to
 * @param {Record<string, any>} payload - the data to persist (in stringified form)
 * @returns {void}
 */
export function persistToCookies (category: string, payload: Record<string, any>): void{
  // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
  if (!process.env.SERVER) {
    // Set 'secure' to true for production
    Object.keys(payload).forEach((key: string) => {
      Cookies.set(
        `${category}.${key}`,
        JSON.stringify(payload[key]),
        {expires: 1, secure: false} // TODO secure: true for production
      )
    })
  }

}

/**
 * Deletes all cookies within a given category
 * @param {string} category - the category within which to delete (e.g. "authentication")
 * @returns {void}
 */
export function deleteCookies(category: string): void{
  const allCookies = Cookies.getAll()

  Object.keys(allCookies).forEach((cookieKey: string) => {
    if(cookieKey.startsWith(`${category}.`)){
      Cookies.remove(cookieKey)
    }
  })
}

/**
 * Gets the authorization token (if any) from local storage
 * @returns {null|string} - auth token, if any
 */
export function getAuthToken(){
  let iter = 0
  let res:string|null = ''
  let token:string|null = null
  do {
    res = localStorage.key(iter)
    if(res?.endsWith('.idToken') && res?.startsWith('CognitoIdentityServiceProvider.')){
      token = localStorage.getItem(res)
      break
    }
    iter++;
  } while (res)


  return token;
}
