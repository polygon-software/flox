import {RouteRecordRaw} from 'vue-router';

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

  'MANAGEMENT_DASHBOARD': {
    path: '/managementDashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManagementDashboard.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
};

export default ROUTES
