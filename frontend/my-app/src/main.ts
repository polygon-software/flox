import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";
import { createApp, provide, h } from 'vue'
import {DefaultApolloClient, provideApolloClient} from '@vue/apollo-composable'

// HTTP connection to the API
const httpLink = createHttpLink({
    // GraphQL API Link TODO from .env
    uri: 'http://localhost:3000/graphql',
})

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        addTypename: false // TODO verify caching auto-updates objects on change...
        // TODO  But setting to "true" breaks mutations! --> ideally only enable for non-mutations?
        // TODO see https://github.com/apollographql/apollo-client/issues/1913
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
