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
   */
  async routeTo(to: RouteRecordRaw): Promise<void | NavigationFailure | undefined>{
    console.log('Pushing route', to.path)
      return this.router.push(to)
  }
}
