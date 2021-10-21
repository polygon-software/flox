import App from './App.vue'
import { createApp, provide, h } from 'vue'

// Quasar
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

// Apollo
import {ApolloClient, createHttpLink, InMemoryCache, split} from "@apollo/client/core";
import {DefaultApolloClient, provideApolloClient} from '@vue/apollo-composable'
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";

// Routing
import { createRouter,createWebHashHistory } from 'vue-router'
import {ROUTES} from "@/router/ROUTES";

// i18n
import {createI18n} from 'vue-i18n'
import en from "./i18n/en.json"
import de from "./i18n/de.json"


// Custom Components TODO move with routes
import MainPage from "@/pages/MainPage.vue";
import LoginPage from "@/pages/LoginPage.vue";

// HTTP link for GraphQL (Queries/Mutations)
const httpLink = createHttpLink({
    // GraphQL API Link
    uri: 'http://localhost:3000/graphql',
})

// WebSocket link for GraphQL (Subscriptions)
const wsLink = new WebSocketLink({
    uri: `ws://localhost:3000/graphql-websocket`,
    options: {
        reconnect: true
    }
});

// Depending on operation, use correct link
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

// Apollo Client setup
const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
        addTypename: false, // We disable auto-adding of __typename property, as this breaks mutations expecting
                            // an object variable. Instead, we manually add __typename in QUERIES/MUTATIONS.ts where
                            // appropriate. This can be changed in case Apollo implements better behavior for this.
    })
})

// Router setup
const routes = Object.values(ROUTES)

    const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// i18n languages
const languages = {
    "en": en,
    "de": de,
}

// i18n setup
const i18n = createI18n({
    locale: 'de', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: languages,
})

// Set up App itself
const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
        provideApolloClient(apolloClient)
    },
    render: () => h(App),
})

// Apply plugins
app.use(router)
app.use(Quasar, quasarUserOptions)
app.use(i18n)

app.mount('#app')
