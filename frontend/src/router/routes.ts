import {RouteRecordRaw} from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {ROLE} from '../../../shared/definitions/ENUM';
import {MY_USER} from 'src/data/queries/USER';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  'MAIN': {
    path: '/',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  'LOGIN': {
    path: '/login',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  'ADD_PRODUCT': {
    path: '/add-product',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/ProductUploadPage.vue') }],
  },

  'MY_PRODUCTS': {
    path: '/my-products',
    component: () => import('layouts/PartnerLayout.vue'),
    children: [{ path: '', component: () => import('pages/MyProductsPage.vue') }],
  },

  'PLAYERS': {
    path: '/players',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/PlayersPage.vue') }],
  },

  'ADMIN_STATISTICS': {
    path: '/admin-statistics',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminStatisticsPage.vue') }],
  },

  'ADMIN_FINANCES': {
    path: '/admin-finances',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminFinancesPage.vue') }],
  },

  'SETTINGS': {
    path: '/settings',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
};

//TODO: Add semi-protected routes
// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
]

/**
 * Returns the layout for the currently logged in user
 * @async
 * @returns {any} - the layout component
 */
async function getUserRoleLayout(): Promise<any>{
  // Get user's data from backend
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>

  // Non-logged in: Redirect to 404
  if(!queryResult?.data?.myUser){
    return import('pages/Error404.vue')
  }


  const userData = queryResult.data.myUser as Record<string, unknown>
  const userRole = userData.role;

  switch(userRole){
    case ROLE.ADMIN:
      return import('layouts/AdminLayout.vue')
    case ROLE.PARTNER:
      return import('layouts/PartnerLayout.vue')
    case ROLE.PLAYER:
      return import('layouts/PlayerLayout.vue')
    default:
      return import('pages/Error404.vue') // TODO possibly 403 forbidden page?
    }
}

export default ROUTES
