// Based on cookie-persisted store state, re-set store to that state
import {Cookies} from 'quasar';

/**
 * This file contains all cookie-related helper functions
 */


/**
 * Persists TODO
 * @param category {string} - sub-category to store the cookie to
 * @param payload
 */
export function persistToCookies (category: string, payload: Record<string, any>): void{
  // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
  if (!process.env.SERVER) {
    // Set 'secure' to true for production
    Object.keys(payload).forEach((key: string) => {
      const data: any = payload[key]
      Cookies.set(
        `authentication.${key}`,
        JSON.stringify(data),
        {expires: 3, secure: false} // TODO optional expiry duration
      )
    })
  } else {
    console.log('TODO called set cookies on server... what do')
  }
  //
  // console.log('state old:', state)
  // // Copy payload to state
  // state = {...payload}
  // console.log('State new:', state)
}

/**
 * Deletes all cookies within a given category
 * @param category
 */
export function deleteCookies(category: string): void{
  const allCookies = Cookies.getAll()

  Object.keys(allCookies).forEach((cookieKey: any) => {
    if(cookieKey.startsWith(`${category}.`)){
      Cookies.remove(cookieKey)
      console.log('Removed', cookieKey)
    }
  })
}
