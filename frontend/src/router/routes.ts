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

  'ADD_PRODUCT': {
    path: '/add-product',
    component: () => import('layouts/PartnerLayout.vue'), // TODO depending on role: admin or partner
    children: [{ path: '', component: () => import('pages/ProductUploadPage.vue') }],
  },

  'MY_PRODUCTS': {
    path: '/my-products',
    component: () => import('layouts/PartnerLayout.vue'), // TODO depending on role: admin or partner
    children: [{ path: '', component: () => import('pages/MyProductsPage.vue') }],
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
  ROUTES.ADD_PRODUCT // TODO: change rules
]

//TODO: Add semi-protected routes
export default ROUTES
