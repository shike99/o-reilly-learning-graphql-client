import { gql } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AuthorizedUser from './AuthorizedUser'
import Users from './Users'

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
  return (
    <BrowserRouter>
      <AuthorizedUser />
      <Users />
    </BrowserRouter>
  )
}

export default App
