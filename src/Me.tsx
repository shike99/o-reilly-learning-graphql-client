import { useQuery } from "@apollo/client"
import { AllUserQuery, ROOT_QUERY } from "./App"

function Me() {
  const { data, loading, error } = useQuery<AllUserQuery>(ROOT_QUERY)

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const logout = () => {
    window.localStorage.removeItem('token')
  }

  return <div>
    {data && (
      <div>
        <img src={data.me.avatar} width={48} height={48} alt="" />
        <h1>{ data.me.name }</h1>
        <button onClick={logout}>logout</button>
      </div>
    )}
  </div>
}

export default Me
