import { useQuery } from '@apollo/client'
import AddFakeUsers from './AddFakeUsers'
import { AllUserQuery, ROOT_QUERY } from './App'

function Users() {
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<AllUserQuery>(ROOT_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <p>loading users...</p>
  if (error) return <p>Error : {error.message}</p>

  return (
    <div>
      <p>{data?.totalUsers} Users</p>
      <button onClick={() => refetch()}>Refetch Users</button>
      <button onClick={() => startPolling(1000)}>Start Polling</button>
      <button onClick={() => stopPolling()}>Stop Polling</button>
      <AddFakeUsers />
      <ul>
        {data?.allUsers.map(({ githubLogin, name, avatar }) => (
          <li key={githubLogin}>
            <img src={avatar} width={48} height={48} alt="" />
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
