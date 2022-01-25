import {
  LocationQuery,
  NavigationFailure,
  RouteLocationNormalizedLoaded,
  Router,
  RouteRecordRaw,
} from 'vue-router';

/**
 * This is a service that is used globally throughout the application for routing
 */
export class RouterService {
  // Router instance
  router: Router;

  /**
   * Constructor
   * @param {Router} router - router instance
   */
  constructor(router: Router) {
    this.router = router;
  }

  /**
   * Routes to a given route, as defined in ROUTES constant
   * @param {RouteRecordRaw} to - the route to go to
   * @param {Record<string, string>} [query] - props to pass to the component, if any
   * @returns {void|NavigationFailure|undefined} - the navigation result
   */
  async routeTo(
    to: RouteRecordRaw,
    query?: Record<string, string>
  ): Promise<void | NavigationFailure | undefined> {
    if (query) {
      return this.router.push({ path: to.path, query: query });
    }

    return this.router.push({ path: to.path });
  }

  /**
   * Set a new URL query
   * @param {Record<string, string>} query - props to pass to the component
   * @returns {void|NavigationFailure|undefined} - the navigation result
   */
  setQuery(
    query?: Record<string, string>
  ): Promise<void | NavigationFailure | undefined> {
    return this.router.push({ query: query });
  }

  /**
   * Returns the current URL query
   * @returns {LocationQuery} - query
   */
  getQuery(): LocationQuery {
    return (
      this.router.currentRoute as unknown as RouteLocationNormalizedLoaded
    ).query;
  }
}
