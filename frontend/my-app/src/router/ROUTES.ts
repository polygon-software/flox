import MainPage from "@/pages/MainPage.vue";
import LoginPage from "@/pages/LoginPage.vue";

/**
 * This file defines all routes used within the application.
 * Access an individual route's path by using e.g. ROUTES.LOGIN.path
 */

const MAIN = { path: '/', component: MainPage }
const LOGIN = { path: '/login', component: LoginPage }


export const ROUTES = {MAIN, LOGIN}
