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
    path: '/management_dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManagementDashboardPage.vue') }],
  },

  'SIGNUP': {
    path: '/company_signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  'SUCCESS': {
    path: '/success',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SuccessPage.vue') }],
  },

  'DOCUMENT_UPLOAD': {
    path: '/document_upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DocumentUploadPage.vue') }],
  },

  'ADMIN_DASHBOARD': {
    path: '/admin_dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminDashboardPage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
};

export default ROUTES

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.SUCCESS,
  ROUTES.SIGNUP,
  ROUTES.DOCUMENT_UPLOAD,
  ROUTES.ADMIN_DASHBOARD //TODO: Add security!!!
]

//TODO: Add semi-protected routes
