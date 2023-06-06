import { RouteRecordRaw } from 'vue-router';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  HOME: {
    path: '/home',
    component: () => import('layouts/SimpleDashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  CREATE_ORDER: {
    path: '/create',
    component: () => import('layouts/SimpleDashboardLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateOrderPage.vue') },
    ],
  },

  EDIT_ORDER: {
    path: '/edit',
    component: () => import('layouts/SimpleDashboardLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CreateOrderPage.vue'),
        props: (route) => ({
          orderUuid: route.params.orderUuid,
        }),
      },
    ],
  },

  LOGIN: {
    path: '/login',
    component: () => import('layouts/ClearLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  ACCOUNT: {
    path: '/account',
    component: () => import('layouts/SimpleDashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/AccountPage.vue') }],
  },
  // Wildcard route for non-covered routes
  WILDCARD: {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404Page.vue'),
  },
};

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [ROUTES.LOGIN];

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
