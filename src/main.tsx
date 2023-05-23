import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { persistCache } from 'apollo3-cache-persist'
import { createClient } from 'graphql-ws'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const cache = new InMemoryCache()
await persistCache({
  cache,
  storage: window.localStorage,
})

if (localStorage.getItem('apollo-cache-persist')) {
  const cacheData = JSON.parse(localStorage.getItem('apollo-cache-persist') || '{}')
  cache.restore(cacheData)
}

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })
const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000/graphql' }))
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      authorization: window.localStorage.getItem('token') || '',
    },
  }))
  return forward(operation)
})
const httpAuthLink = authLink.concat(httpLink)

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpAuthLink
)

const client = new ApolloClient({
  cache,
  link,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
