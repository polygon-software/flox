import {NavigationFailure, Router, RouteRecordRaw} from 'vue-router';

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
   * @returns {void|NavigationFailure|undefined} - Navigation result, if any
   */
  async routeTo(to: RouteRecordRaw): Promise<void | NavigationFailure | undefined>{
      return this.router.push(to)
  }
}
