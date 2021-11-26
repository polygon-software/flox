import {NavigationFailure, Router, RouteRecordRaw} from 'vue-router';

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
   * @param {Record<string, unknown>} [variables] - variables to pass to the route, if any
   */
  async routeTo(to: RouteRecordRaw, variables?: Record<string, unknown>) : Promise<void | NavigationFailure | undefined>{
    // TODO apply variables
    return this.router.push(to)
  }
}
