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
    children: [{ path: '', component: () => import('pages/generic/LoginPage.vue') }],
  },

  'SET_PASSWORD': {
    path: '/set-password',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/generic/SetPasswordPage.vue') }],
  },

  'MANAGEMENT_EMPLOYEE_DATA': {
    path: '/management-employee-data',
    component: () => import('layouts/ManagementLayout.vue'),
    children: [{ path: '', component: () => import('pages/company/ManagementEmployeeDataPage.vue') }],
  },

  'MANAGEMENT_EMPLOYEE_TASKS': {
    path: '/management-employee-tasks',
    component: () => import('layouts/ManagementLayout.vue'),
    children: [{ path: '', component: () => import('pages/company/ManagementEmployeeTaskPage.vue') }],
  },

  'EMPLOYEE_DASHBOARD': {
    path: '/employee-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/employee/EmployeeDashboardPage.vue') }],
  },

  'BANK_DASHBOARD': {
    name: 'bank_dashboard',
    path: '/bank-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/bank/BankDashboard.vue') }],
  },

  'MANAGEMENT_EMPLOYEE_VIEW': {
    path: '/management-employee-view',
    component: () => import('layouts/ManagementLayout.vue'),
    children: [{ path: '', component: () => import('pages/employee/EmployeeDashboardPage.vue') }],
  },

  'SIGNUP': {
    path: '/company-signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/generic/SignupPage.vue') }],
  },

  'SUCCESS': {
    path: '/success',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/generic/GenericSuccessPage.vue') }],
  },

  'DOCUMENT_UPLOAD': {
    path: '/document-upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/company/DocumentUploadPage.vue') }],
  },

  // Company: New employee
  'NEW_EMPLOYEE_PAGE': {
    path: '/new-employee',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/company/NewEmployeePage.vue') }],
  },

  // SOI: New employee
  'NEW_SOI_EMPLOYEE_PAGE': {
    path: '/new-soi-employee',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/NewSOIEmployeePage.vue') }],
  },

  // SOI Admin: SOI Employees
  'ADMIN_EMPLOYEES': {
    path: '/admin-employees',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/SOIAdminEmployeePage.vue') }],
  },

  // SOI Admin: Dossiers
  'ADMIN_DOSSIERS': {
    path: '/admin-dossiers',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/SOIAdminDossierPage.vue') }],
  },

  // SOI Admin: Provisions
  'ADMIN_PROVISION': {
    path: '/admin-provision',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/SOIAdminProvisionPage.vue') }],
  },

  // SOI Employee: Applications
  'APPLICATIONS': {
    path: '/applications',
    component: () => import('layouts/SOIEmployeeLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/SOIApplicationPage.vue') }],
  },

  // SOI Admin: Register a bank
  'REGISTER_BANK': {
    path: '/register-bank',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/RegisterBankPage.vue') }],
  },

  // Employee: Add new dossier
  'NEW_DOSSIER_PAGE': {
    path: '/new-dossier',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NewDossierPage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/generic/Error404.vue'),
  },
};

export default ROUTES

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.SUCCESS,
  ROUTES.DOCUMENT_UPLOAD,
  ROUTES.SET_PASSWORD
]

//TODO: Add semi-protected routes

