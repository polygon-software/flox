import {RouteRecordRaw} from 'vue-router';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {ROLE} from '../../../shared/definitions/ENUMS';

/**
 * This file defines the routes available within the application
 */


// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  // Redirect to dashboards handled by router
  'MAIN': {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [],
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
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/company/ManagementEmployeeDataPage.vue') }],
  },

  'MANAGEMENT_EMPLOYEE_TASKS': {
    path: '/management-employee-tasks',
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/company/ManagementEmployeeTaskPage.vue') }],
  },

  'EMPLOYEE_DASHBOARD': {
    path: '/employee-dashboard',
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/employee/EmployeeDashboardPage.vue') }],
  },

  // Bank: Main dashboard
  'BANK_DASHBOARD': {
    path: '/bank-dashboard',
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/bank/BankDashboard.vue') }],
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

  // SOI Admin: Banks
  'ADMIN_BANK': {
    path: '/admin-bank',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/SOIAdminBankPage.vue') }],
  },

  // SOI Employee: Applications
  'APPLICATIONS': {
    path: '/applications',
    component: () => getUserRoleLayout(),
    children: [{ path: '', component: () => import('pages/soi/SOIApplicationPage.vue') }],
  },

  // SOI Admin: Register a bank
  'REGISTER_BANK': {
    path: '/register-bank',
    component: () => import('layouts/SOIAdminLayout.vue'),
    children: [{ path: '', component: () => import('pages/soi/RegisterBankPage.vue') }],
  },

  // Employee: Add new dossier
  'NEW_DOSSIER': {
    path: '/new-dossier',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/employee/NewDossierPage.vue') }],
  },

  // Employee: Final page of new dossier creation
  'DOSSIER_FINAL_DOCUMENT': {
    path: '/new-dossier-document',
    component: () => import('layouts/PrintLayout.vue'),
    children: [{ path: '', component: () => import('pages/employee/DossierFinalDocumentPage.vue') }],
  },

  // Employee: Dossier mandatory document upload
  'DOSSIER_DOCUMENT_UPLOAD': {
    path: '/dossier-document-upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/employee/DossierDocumentUploadPage.vue') }],
  },

  // Wildcard route for non-covered routes
  'WILDCARD': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/generic/Error404.vue')
  },

  // Explicit error for non-allowed routes
  'ERROR': {
    path: '/error',
    component: () => import('pages/generic/Error404.vue')
  },
};

export default ROUTES

// Routes that can be accessed without being logged in
export const PUBLIC_ROUTES: RouteRecordRaw[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.SUCCESS,
  ROUTES.DOCUMENT_UPLOAD,
  ROUTES.SET_PASSWORD,
]

/**
 * Routes that have additional access constraints
 * allowedRoles specifies roles that don't have to fulfill constraints to access these pages,
 * constrainedRoles must provide the specified query parameters to access the page
 */
export const CONSTRAINED_ROUTES = [
  // Bank dashboard: also allowed to admins when 'bid' is given
  {
    path: ROUTES.BANK_DASHBOARD.path,
    allowedRoles: [ROLE.BANK],
    constrainedRoles: [ROLE.SOI_ADMIN],
    necessaryQueryParams: ['bid']
  },
  // Company dashboards: also allowed to admins when 'cid' is given
  {
    path: ROUTES.MANAGEMENT_EMPLOYEE_DATA.path,
    allowedRoles: [ROLE.COMPANY],
    constrainedRoles: [ROLE.SOI_ADMIN],
    necessaryQueryParams: ['cid']
  },
  {
    path: ROUTES.MANAGEMENT_EMPLOYEE_TASKS.path,
    allowedRoles: [ROLE.COMPANY],
    constrainedRoles: [ROLE.SOI_ADMIN],
    necessaryQueryParams: ['cid']
  },
  // Employee Dashboard : also allowed to admins when 'bid' is given
  {
    path: ROUTES.MANAGEMENT_EMPLOYEE_TASKS.path,
    allowedRoles: [ROLE.COMPANY, ROLE.EMPLOYEE],
    constrainedRoles: [ROLE.SOI_ADMIN],
    necessaryQueryParams: ['bid']
  }
]


/**
 * Returns the layout for the currently logged in user
 * @async
 * @returns {any} - the layout component
 */
async function getUserRoleLayout(): Promise<any>{
  // Get user's data from backend
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>

  // Non-logged in: Redirect to 404
  if(!queryResult?.data?.getMyUser){
    return import('layouts/MainLayout.vue')
  }

  const userData = queryResult.data.getMyUser as Record<string, unknown>
  const userRole = userData.role;

  switch(userRole){
    case ROLE.SOI_ADMIN:
      return import('layouts/SOIAdminLayout.vue')
    case ROLE.SOI_EMPLOYEE:
      return import('layouts/SOIEmployeeLayout.vue')
    case ROLE.COMPANY:
      return import('layouts/ManagementLayout.vue')
    default:
      return import('layouts/MainLayout.vue')
  }
}
