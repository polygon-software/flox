import {ApolloClient} from '@apollo/client/core'
import {provideApolloClient} from '@vue/apollo-composable'
import { boot } from 'quasar/wrappers'
import { getClientOptions } from 'src/apollo'

export default boot(
  ({ssrContext }) => {

    // Default client.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const options = getClientOptions(ssrContext)

    // Apollo Client setup
    const apolloClient = new ApolloClient(options)

    provideApolloClient(apolloClient)
  }
)
