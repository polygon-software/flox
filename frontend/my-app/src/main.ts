import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import {ApolloClient, createHttpLink, InMemoryCache, split} from "@apollo/client/core";
import { createApp, provide, h } from 'vue'
import {DefaultApolloClient, provideApolloClient} from '@vue/apollo-composable'
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";
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


// Routes TODO move to separate file
const routes = [
    { path: '/', component: MainPage },
    { path: '/login', component: LoginPage },
]


const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
        provideApolloClient(apolloClient)
    },
    render: () => h(App),
})

app.use(Quasar, quasarUserOptions).mount('#app')
