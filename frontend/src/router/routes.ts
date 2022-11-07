import { RouteRecordRaw } from 'vue-router';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  MAIN: {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  LOGIN: {
    path: '/login',
    component: () => import('layouts/ClearLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  SIGNUP: {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  ACCOUNT: {
    path: '/account',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/AccountPage.vue') }],
  },

  ALIAS: {
    path: '/alias',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/AliasPage.vue') }],
  },

  FILES: {
    path: '/files',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/FilesPage.vue') }],
  },

  ACCESS_CONTROL: {
    path: '/access-control',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AccessControlPage.vue') },
    ],
  },

  SAMPLE: {
    path: '/sample',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/SamplePage.vue') }],
  },

  // Wildcard route for non-covered routes
  WILDCARD: {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
};

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [ROUTES.LOGIN, ROUTES.SIGNUP];

// Type for constrained route
type ConstrainedRoute = {
  path: string; // URL path
  allowedRoles: string[]; // Roles that are allowed to access the path
};

/*
 * Routes that have additional access constraints
 * allowedRoles specifies roles that don't have to fulfill constraints to access these pages,
 * constrainedRoles must provide the specified query parameters to access the page
 * TODO Application specific: Add routes here
 */

export const CONSTRAINED_ROUTES: ConstrainedRoute[] = [];

export default ROUTES;
