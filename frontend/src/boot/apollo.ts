import {ApolloClient} from '@apollo/client/core'
import {provideApolloClient} from '@vue/apollo-composable'
import { boot } from 'quasar/wrappers'
import { getClientOptions } from 'src/apollo'

// TODO figure out why this suddenly is an issue
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default boot(({ ssrContext }) => {

    // Default client.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const options = getClientOptions(ssrContext)

    // Apollo Client setup
    const apolloClient = new ApolloClient(options)

    provideApolloClient(apolloClient)
  }
)
