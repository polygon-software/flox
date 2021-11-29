import {RouteRecordRaw} from 'vue-router';

/**
 * This file defines the routes available within the application
 */


// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  'MAIN': {
    name: 'main',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  'LOGIN': {
    name: 'login',
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  'SET_PASSWORD': {
    name: 'set_password',
    path: '/set-password',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SetPasswordPage.vue') }],
  },

  'MANAGEMENT_DASHBOARD': {
    name: 'management_dashboard',
    path: '/management-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManagementDashboardPage.vue') }],
  },

  'EMPLOYEE_DASHBOARD': {
    name: 'employee_dashboard',
    path: '/employee-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EmployeeDashboardPage.vue') }],
  },

  'SIGNUP': {
    name: 'signup',
    path: '/company-signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  'SUCCESS': {
    name: 'success',
    path: '/success',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SuccessPage.vue') }],
  },

  'DOCUMENT_UPLOAD': {
    name: 'document_upload',
    path: '/document-upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DocumentUploadPage.vue') }],
  },

  'ADMIN_DASHBOARD': {
    name: 'admin_dashboard',
    path: '/admin-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminDashboardPage.vue') }],
  },
  'NEW_EMPLOYEE_PAGE': {
    name: 'new_employee_page',
    path: '/new-employee',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NewEmployeePage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    name: 'wildcard',
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
  ROUTES.MANAGEMENT_DASHBOARD,
  ROUTES.EMPLOYEE_DASHBOARD,
  ROUTES.ADMIN_DASHBOARD //TODO: Add security!!!
]

//TODO: Add semi-protected routes

