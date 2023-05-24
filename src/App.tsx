import { gql, useApolloClient } from '@apollo/client'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AuthorizedUser from './AuthorizedUser'
import Photos from './Photos'
import PostPhoto from './PostPhoto'
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
    totalPhotos
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
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

export interface PhotoQuery {
  id: string
  name: string
  url: string
}

export interface AllUserQuery {
  totalUsers: number
  totalPhotos: number
  allUsers: UserQuery[]
  me: UserQuery
  allPhotos: PhotoQuery[]
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
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AuthorizedUser />
                <Users />
                <Photos />
              </>
            }
          />
          <Route path="/newPhoto" Component={PostPhoto} />
          <Route element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
