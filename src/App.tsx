import { gql, useApolloClient } from '@apollo/client'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AuthorizedUser from './AuthorizedUser'
import Users from './Users'

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`
export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`

export interface UserQuery {
  githubLogin: string
  name: string
  avatar: string
}

export interface AllUserQuery {
  totalUsers: number
  allUsers: UserQuery[]
  me: UserQuery
}

function App() {
  const client = useApolloClient()

  useEffect(() => {
    const listenForUsers = client.subscribe({ query: LISTEN_FOR_USERS }).subscribe(({ data }) => {
      if (!data) return

      const cachedData = client.readQuery<AllUserQuery>({ query: ROOT_QUERY })
      if (!cachedData) return

      client.writeQuery<AllUserQuery>({
        query: ROOT_QUERY,
        data: {
          ...cachedData,
          totalUsers: cachedData.totalUsers + 1,
          allUsers: [...cachedData.allUsers, data.newUser],
        },
      })
    })

    return () => listenForUsers.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <AuthorizedUser />
      <Users />
    </BrowserRouter>
  )
}

export default App
