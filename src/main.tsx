import ReactDOM from 'react-dom/client'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { persistCache } from 'apollo3-cache-persist'
import App from './App.tsx'
import './index.css'

const cache = new InMemoryCache()
await persistCache({
  cache,
  storage: window.localStorage
})

if (localStorage.getItem('apollo-cache-persist')) {
  const cacheData = JSON.parse(localStorage.getItem('apollo-cache-persist') || '{}')
  cache.restore(cacheData)
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  headers: {
    authorization: window.localStorage.getItem('token') || ''
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
