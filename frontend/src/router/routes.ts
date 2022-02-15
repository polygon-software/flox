import { RouteRecordRaw } from 'vue-router';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  MAIN: {
    path: '/',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/generic/MainPage.vue') },
    ],
  },

  LOGIN: {
    path: '/login',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/generic/LoginPage.vue') },
    ],
  },

  SIGNUP: {
    path: '/signup',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/generic/SignupPage.vue') }],
  },

  SUCCESS: {
    path: '/success',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/generic/SuccessPage.vue') }],
  },

  // Wildcard route for non-covered routes
  WILDCARD: {
    path: '/:catchAll(.*)*',
    component: () => import('pages/generic/Error404.vue'),
  },
};

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.SUCCESS,
];

export default ROUTES;
