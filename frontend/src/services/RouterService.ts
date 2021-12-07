import {NavigationFailure, RouteParams, Router, RouteRecordRaw} from 'vue-router';

/**
 * This is a service that is used globally throughout the application for routing
 */

export class RouterService {

  // Router instance
  router: Router

  constructor(router: Router) {
      this.router = router
  }

  /**
   * Routes to a given route, as defined in ROUTES constant
   * @param to {RouteRecordRaw} - the route to go to
   * @param {RouteParams} [params] - params to pass to the route, if any
   */
  async routeTo(to: RouteRecordRaw) : Promise<void | NavigationFailure | undefined>{
    // TODO ensure this works
    // if (params !== null && params !== undefined) {
    //   const toObject = to as unknown as Record<string, unknown>
    //   return this.router.push({...toObject, params: params})
    // }
    return this.router.push(to)
  }
}
