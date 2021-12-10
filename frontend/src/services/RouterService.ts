import {LocationQueryRaw, NavigationFailure, RouteLocationRaw, Router, RouteRecordRaw} from 'vue-router';

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
   * @param {RouteLocationRaw} to - the route to go to
   * @param {Record<string, string>} [query] - props to pass to the component, if any
   */
  async routeTo(to: RouteRecordRaw, query?: Record<string, string>): Promise<void | NavigationFailure | undefined>{


    if(query){
      return this.router.push({path: to.path, query})
    }

    return this.router.push(to)
  }
}
