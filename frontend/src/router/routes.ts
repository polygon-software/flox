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

  'SET_PASSWORD': {
    path: '/set-password',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SetPasswordPage.vue') }],
  },

  'MANAGEMENT_DASHBOARD': {
    path: '/management-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManagementDashboardPage.vue') }],
  },

  'EMPLOYEE_DASHBOARD': {
    path: '/employee-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EmployeeDashboardPage.vue') }],
  },

  'SIGNUP': {
    path: '/company-signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  'SUCCESS': {
    path: '/success',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/GenericSuccessPage.vue') }],
  },

  'DOCUMENT_UPLOAD': {
    path: '/document-upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DocumentUploadPage.vue') }],
  },

  'ADMIN_DASHBOARD': {
    path: '/admin-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminDashboardPage.vue') }],
  },
  'NEW_EMPLOYEE_PAGE': {
    path: '/new-employee',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NewEmployeePage.vue') }],
  },
  'NEW_ASSIGNMENT_PAGE': {
    path: '/new-assignment',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NewAssignmentPage.vue') }],
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
  ROUTES.SET_PASSWORD,
  ROUTES.DOCUMENT_UPLOAD,
  ROUTES.MANAGEMENT_DASHBOARD,
  ROUTES.EMPLOYEE_DASHBOARD,
  ROUTES.NEW_EMPLOYEE_PAGE,
  ROUTES.NEW_ASSIGNMENT_PAGE,
  ROUTES.ADMIN_DASHBOARD //TODO: Add security!!!
]

//TODO: Add semi-protected routes

