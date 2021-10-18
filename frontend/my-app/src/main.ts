import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";
import { createApp, provide, h } from 'vue'
import {DefaultApolloClient, provideApolloClient} from '@vue/apollo-composable'

// HTTP connection to the API
const httpLink = createHttpLink({
    // GraphQL API Link
    uri: 'http://localhost:3000/graphql',
})

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        addTypename: false, // We disable auto-adding of __typename property, as this breaks mutations expecting
                            // an object variable. Instead, we manually add __typename in QUERIES/MUTATIONS.ts where
                            // appropriate. This can be changed in case Apollo implements better behavior for this.
    })
})

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
        provideApolloClient(apolloClient)
    },

    render: () => h(App),
})


app.use(Quasar, quasarUserOptions).mount('#app')
