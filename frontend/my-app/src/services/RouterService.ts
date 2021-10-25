import {NavigationFailure, Router} from 'vue-router';

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
   * @param to {TODO}
   */
  async routeTo(to: any): Promise<void | NavigationFailure | undefined>{
      return this.router.push(to)
  }
}
