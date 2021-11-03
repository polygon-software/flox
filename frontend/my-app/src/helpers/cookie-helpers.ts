import {Cookies} from 'quasar';

/**
 * This file contains all cookie-related helper functions
 */


/**
 * Persists a given payload to one or multiple cookies
 * @param category {string} - sub-category to store the cookie to
 * @param payload {Record<string, any>} - the data to persist (in stringified form)
 */
export function persistToCookies (category: string, payload: Record<string, any>): void{

  // TODO @johannschwabe maybe use this? could work
  // const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies


  // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
  if (!process.env.SERVER) {
    // Set 'secure' to true for production
    Object.keys(payload).forEach((key: string) => {
      const data: any = payload[key]
      Cookies.set(
        `${category}.${key}`,
        JSON.stringify(data),
        {expires: 1, secure: false} // TODO secure: true for production
      )
    })
  } else {
    //TODO handle cookie stuff for SSR
    console.log('TODO called set cookies on server... what do')
  }

}

/**
 * Deletes all cookies within a given category
 * @param category {string} - the category within which to delete (e.g. "authentication")
 */
export function deleteCookies(category: string): void{
  const allCookies = Cookies.getAll()

  Object.keys(allCookies).forEach((cookieKey: string) => {
    if(cookieKey.startsWith(`${category}.`)){
      Cookies.remove(cookieKey)
    }
  })
}
