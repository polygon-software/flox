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
  async routeTo(to: RouteRecordRaw|string, params?: RouteParams) : Promise<void | NavigationFailure | undefined>{
    //TODO: Pushing with params is not working at the moment
    if (params) {
      const toObject = to as unknown as Record<string, unknown>
      return this.router.push({...toObject, params: params})
    }
    return this.router.push(to)
  }
}
