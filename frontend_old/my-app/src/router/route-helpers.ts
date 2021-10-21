import {useRouter} from "vue-router";
import {ROUTES} from "@/router/ROUTES";
import {AuthenticationService} from "@/services/AuthService";
import * as store from "../store/store"

/**
 * This file defines all router-related helper functions.
 */


/**
 * Sets up the router's routing safeguards. Used only once in App.vue.
 * @param $authService { AuthenticationService } - the global AuthenticationService instance
 */
export function setupRouter($authService: AuthenticationService){
    const router = useRouter()

    router.beforeEach((to) => {
        const loginPath = ROUTES.LOGIN.path

        if(to.path != loginPath && !store.getLoggedInStatus.value){
            return loginPath
        }
    })
}
