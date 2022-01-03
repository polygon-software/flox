import {RouteRecordRaw} from 'vue-router';

/**
 * This file defines the routes available within the application
 */

// All routes available within the application
const ROUTES: Record<string, RouteRecordRaw> = {
  'MAIN': {
    path: '/',
    component: () => import('layouts/PlayerLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  'LOGIN': {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  'ADD_PRODUCT': {
    path: '/add-product',
    component: () => import(`layouts/${getUserRoleLayout()}.vue`),
    children: [{ path: '', component: () => import('pages/ProductUploadPage.vue') }],
  },

  'PRODUCT_DETAIL': {
    path: '/product-detail',
    component: () => import(`layouts/${getUserRoleLayout()}.vue`),
    children: [{ path: '', component: () => import('pages/ProductDetailPage.vue') }],
  },

  'MY_PRODUCTS': {
    path: '/my-products',
    component: () => import(`layouts/${getUserRoleLayout()}.vue`),
    children: [{ path: '', component: () => import('pages/MyProductsPage.vue') }],
  },

  'SETTINGS': {
    path: '/settings',
    component: () => import(`layouts/${getUserRoleLayout()}.vue`),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
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
]

/**
 * Returns the layout name for the currently logged in user
 * @returns {string} - the layout's name
 */
function getUserRoleLayout(): string{
  return 'PartnerLayout' // TODO actual functionality
  // return 'AdminLayout'
}

//TODO: Add semi-protected routes
export default ROUTES
