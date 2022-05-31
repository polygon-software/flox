import {RouteRecordRaw} from 'vue-router';
import {ROLE} from 'src/data/ENUM';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  'MAIN': {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  'LOGIN': {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  'SIGNUP': {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  'SAMPLE': {
    path: '/sample',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SamplePage.vue') }],
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
  ROUTES.SIGNUP,
  ROUTES.SAMPLE,
];

/*
 * Routes that have additional access constraints
 * allowedRoles specifies roles that don't have to fulfill constraints to access these pages,
 * constrainedRoles must provide the specified query parameters to access the page
 * TODO enable only with roles module active
 */
export const CONSTRAINED_ROUTES = [
  { // TODO this is just an example
    path: ROUTES.SAMPLE.path,
    allowedRoles: [ROLE.ADMIN],
  },
];

export default ROUTES
