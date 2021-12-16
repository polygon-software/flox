import {RouteRecordRaw} from 'vue-router';
import {sleep} from 'src/helpers/general-helpers';
import {QLayout} from 'quasar';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/QUERIES';
import {ROLE} from '../../../shared/definitions/ENUM';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  'MAIN': {
    path: '/',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: async () => await getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  'LOGIN': {
    path: '/login',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: async () => await getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  'ADD_PRODUCT': {
    path: '/add-product',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: async () => await getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/ProductUploadPage.vue') }],
  },

  'MY_PRODUCTS': {
    path: '/my-products',
    component: () => import('layouts/PartnerLayout.vue'),
    children: [{ path: '', component: () => import('pages/MyProductsPage.vue') }],
  },

  'SETTINGS': {
    path: '/settings',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: async () => await getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
};
// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.ADD_PRODUCT // TODO: change rules
]

/**
 * Returns the layout name for the currently logged in user
 * @returns {any} - the layout component
 */
async function getUserRoleLayout(): Promise<any>{
  // Get user's data
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>
  const userData = queryResult.data.myUser as Record<string, unknown>
  const userRole = userData.role;

  if(!userRole){
    throw new Error('Not logged in') // TODO redirect to error page
  }

  switch(userRole){
    case ROLE.ADMIN:
      return import('layouts/AdminLayout.vue')
    case ROLE.PARTNER:
      return import('layouts/PartnerLayout.vue')
    case ROLE.PLAYER:
      return import('layouts/PlayerLayout.vue')
    default:
      throw new Error('Not logged in, or no valid role') // TODO redirect to error page
    }
}

//TODO: Add semi-protected routes
export default ROUTES
