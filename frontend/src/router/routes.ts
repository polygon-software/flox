import { RouteRecordRaw } from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {ROLE} from 'src/data/ENUM';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  // Admin: Customers
  CUSTOMERS: {
    path: '/customers',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [
      { path: '', component: () => import('pages/admin/CustomersListPage.vue') },
      {
        path: '/:catchAll(.*)',
        component: () => import('pages/general/CustomerPage.vue'),
        props: route => ({ customerId: route.path.split('/')[2] })
      },
      {
        path: '/:catchAll(.*)/:catchAll(.*)',
        component: () => import('pages/general/ProjectPage.vue'),
        props: route => ({ projectId: route.path.split('/')[3] })
      },
    ],
  },

  // General: Account
  ACCOUNT: {
    path: '/account',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [
      { path: '', component: () => import('pages/general/AccountPage.vue') },
    ]
  },

  // General: Share
  SHARE: {
    path: '/share',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => getUserRoleLayout(),
    children: [
      { path: '', component: () => import('pages/general/SharePage.vue') },
    ]
  },

  LOGIN: {
    path: '/login',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/general/LoginPage.vue') },
    ],
  },

  SIGNUP: {
    path: '/signup',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('pages/general/SignupPage.vue') }],
  },

  SUCCESS: {
    path: '/success',
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('pages/general/SuccessPage.vue') }],
  },

  // Wildcard route for non-covered routes
  WILDCARD: {
    path: '/:catchAll(.*)*',
    component: () => import('pages/general/Error404.vue'),
  },
};

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.SUCCESS,
];

export default ROUTES;

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
    return import('layouts/UserLayout.vue')
  }

  const userData = queryResult.data.myUser as Record<string, unknown>
  const userRole = userData.role;

  switch(userRole){
    case ROLE.ADMIN:
      return import('layouts/AdminLayout.vue')
    case ROLE.USER:
    default:
      return import('layouts/UserLayout.vue')
  }
}
