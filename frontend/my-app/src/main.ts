import App from './App.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";
import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

// HTTP connection to the API
const httpLink = createHttpLink({
    // GraphQL API Link TODO from .env
    uri: 'http://localhost:3000/graphql',
})

// Create the apollo client
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        addTypename: false // TODO verify caching... setting to "true" breaks mutations!
    })
})

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App),
})


app.use(Quasar, quasarUserOptions).mount('#app')
