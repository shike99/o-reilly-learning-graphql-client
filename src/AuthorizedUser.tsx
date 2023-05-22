import { gql, useApolloClient, useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AllUserQuery, ROOT_QUERY } from "./App"
import Me from "./Me"

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`

interface GithubAuthMutation {
  githubAuth: {
    token: string
  }
}

function AuthorizedUser() {
  const [signingIn, setSigningIn] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const client = useApolloClient()
  const [authorize, { loading, error }] = useMutation<GithubAuthMutation>(GITHUB_AUTH_MUTATION, {
    update: (caches, {data}) => {
      window.localStorage.setItem('token', data?.githubAuth.token || '')
      navigate('/')
      setSigningIn(false)
    },
    refetchQueries: [ROOT_QUERY],
  })

  useEffect(() => {
    if (location.search.match(/code=/)) {
      setSigningIn(true)
      const code = location.search.replace("?code=", "")
      authorize({ variables: { code } })
    }
  }, [location])

  const requestCode = () => {
    const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
  }

  const logout = async () => {
    window.localStorage.removeItem('token')
    const allUsers = client.readQuery<AllUserQuery>({ query: ROOT_QUERY })
    client.writeQuery({ query: ROOT_QUERY, data: { ...allUsers, me: null } })
  }

  if (loading) return <p>Authorizing User...</p>
  if (error) return <p>Authorize Failed</p>

  return <div>
    <Me requestCode={requestCode} signingIn={signingIn} logout={logout} />
  </div>
}

export default AuthorizedUser
