import { useQuery } from '@apollo/client'
import { AllUserQuery, ROOT_QUERY, UserQuery } from './App'

function Me({ requestCode, logout, signingIn }: { requestCode: () => void; logout: () => void; signingIn: boolean }) {
  const { data, loading, error } = useQuery<AllUserQuery>(ROOT_QUERY)

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {data && data.me ? (
        <CurrentUser {...data.me} logout={logout} />
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with GitHub
        </button>
      )}
    </div>
  )
}

function CurrentUser({ name, avatar, logout }: UserQuery & { logout: () => void }) {
  return (
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Me
