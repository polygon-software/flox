import {ApolloClient} from '@apollo/client/core'
import {provideApolloClient} from '@vue/apollo-composable'
import { boot } from 'quasar/wrappers'
import { getClientOptions } from 'src/apollo'

export default boot(
  ({}) => {


    // Default client.
    const options = getClientOptions()

    // Apollo Client setup
    const apolloClient = new ApolloClient(options)

    provideApolloClient(apolloClient)
  }
)
