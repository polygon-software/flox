import {
  NavigationFailure,
  Router,
  RouteRecordRaw,
  useRouter,
  useRoute,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import {values} from "lodash";

/**
 * This is a service that is used globally throughout the application for routing
 */
export class RouterService {
  // Router instance
  router: Router;
  route: RouteLocationNormalizedLoaded;

  /**
   * Constructor
   */
  constructor() {
    this.router = useRouter();
    this.route = useRoute();
  }

  /**
   * Routes to a given route, as defined in ROUTES constant.
   * @param {RouteRecordRaw} to - the route to go to.
   * @param {Record<string, string>} [query] - props to pass to the component, if any.
   * @param {boolean} keepQuery - keep the current query and add new query parameters if given.
   * @returns {void|NavigationFailure|undefined} - the navigation result.
   */
  async routeTo(
    to: RouteRecordRaw,
    query?: Record<string, string>,
    keepQuery = false
  ): Promise<void | NavigationFailure | undefined> {
    if (keepQuery) {
      if (query) {
        return this.router.push({
          path: to.path,
          query: { ...this.route.query, ...query },
        });
      } else {
        return this.router.push({
          path: to.path,
          query: { ...this.route.query },
        });
      }
    } else {
      if (query) {
        return this.router.push({ path: to.path, query });
      } else {
        return this.router.push({ path: to.path });
      }
    }
  }

  /**
   * Adds given parameters to the URL query.
   * @param {Record<string, string[]>} params - query parameters.
   * @returns {void|NavigationFailure|undefined} - the navigation result.
   */
  async pushToQuery(
    params: Record<string, string | string[]>
  ): Promise<void | NavigationFailure | undefined> {
    return this.router.push({
      path: this.route.path,
      query: { ...this.route.query, ...params },
    });
  }

  /**
   * Returns the requested query parameter.
   * @param {string} key - parameter name
   * @returns {Array<string> | null} key - requested parameter
   */
  getQueryParam(key: string): string[] | null {
    const params: string[] = []
    const query = this.route.query[key]
    if (query instanceof Array) {
      Object.values(query).forEach(param => {
        params.push(param as string)
      })
      return params
    }
    else {
      return [(query as string)]
    }
  }
}
