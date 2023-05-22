import { gql, useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ROOT_QUERY } from "./App"
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
  const [authorize, { data, loading, error }] = useMutation<GithubAuthMutation>(GITHUB_AUTH_MUTATION, {
    refetchQueries: [ROOT_QUERY],
    update: (caches, {data}) => {
      window.localStorage.setItem('token', data?.githubAuth.token || '')
      navigate('/')
      setSigningIn(false)
    }
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

  if (loading) return <p>Authorizing User...</p>
  if (error) return <p>Authorize Failed</p>

  return <div>
    <Me />
    <button onClick={requestCode} disabled={signingIn}>Sign In with GitHub</button>
  </div>
}

export default AuthorizedUser
