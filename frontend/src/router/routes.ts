import { RouteRecordRaw } from 'vue-router';
import {ROLE} from 'src/data/ENUM';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  HOME: {
    path: '/',
    component: () => import('layouts/Layout.vue'),
  },
  // Admin: Customers
  CUSTOMERS: {
    path: '/customers',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/CustomersListPage.vue') },
      {
        path: ':customerId',
        component: () => import('pages/general/CustomerPage.vue'),
        props: route => ({ customerId: route.params.customerId })
      },
      {
        path: ':customerId/:projectId',
        component: () => import('pages/general/ProjectPage.vue'),
        props: route => ({ projectId: route.params.projectId })
      },
      {
        path: ':customerId/:projectId/:stationId',
        component: () => import('pages/general/DataVisualisationPage.vue'),
        props: route => ({ stationId: route.params.stationId })
      },
      {
        path: ':customerId/:projectId/:stationId/edit',
        component: () => import('pages/general/ParametersPage.vue'),
        props: route => ({ parametersId: route.params.stationId })
      },
    ],
  },

  // General: Account
  ACCOUNT: {
    path: '/account',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/general/AccountPage.vue') },
    ]
  },

  // General: Share
  SHARE: {
    path: '/share',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/general/SharePage.vue') },
    ]
  },

  // General: Status
  STATUS: {
    path: '/status',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/general/StatusPage.vue') },
    ]
  },

  LOGIN: {
    path: '/login',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/general/LoginPage.vue') },
    ],
  },

  SIGNUP: {
    path: '/signup',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/Layout.vue'),
    children: [{ path: '', component: () => import('pages/general/SignupPage.vue') }],
  },

  SUCCESS: {
    path: '/success',
    component: () => import('layouts/Layout.vue'),
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


/*
 * Routes that have additional access constraints
 * allowedRoles specifies roles that don't have to fulfill constraints to access these pages,
 * constrainedRoles must provide the specified query parameters to access the page
 */
export const CONSTRAINED_ROUTES = [
  // Bank dashboard: also allowed to admins when 'bid' is given
  {
    path: ROUTES.CUSTOMERS.path,
    allowedRoles: [ROLE.ADMIN],
  },
]

export default ROUTES;
