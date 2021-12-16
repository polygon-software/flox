import {LocationQueryRaw, NavigationFailure, Router, RouteRecordRaw} from 'vue-router';

/**
 * This is a service that is used globally throughout the application for routing
 */
export class RouterService {

    // Router instance
    router: Router

  /**
   * Constructor
   * @param {Router} router - router instance
   */
    constructor(router: Router) {
        this.router = router
    }


  /**
   * Routes to a given route, as defined in ROUTES constant
   * @param {RouteRecordRaw} to - the route to go to
   * @param {Record<string, unknown>} [queryParams] - params to pass to the route, if any
   * @returns {void|NavigationFailure|undefined} - Navigation result, if any
   */
  async routeTo(to: RouteRecordRaw, queryParams?: Record<string, unknown>) : Promise<void | NavigationFailure | undefined>{
    // TODO ensure this works
    if (queryParams !== null && queryParams !== undefined) {
      const toObject = to as unknown as Record<string, unknown>
      return this.router.push({...toObject, query: queryParams as LocationQueryRaw})
    }
    return this.router.push(to)
  }
}
