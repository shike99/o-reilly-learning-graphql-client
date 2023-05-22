import { gql, useMutation } from "@apollo/client"
import { ROOT_QUERY } from "./App"

interface UserQuery {
  githubLogin: string
  name: string
  avatar: string
}

interface AddFakeUsers {
  addFakeUsers: UserQuery[]
}

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`

function AddFakeUsers() {
  const [addFakeUsers, {data,loading,error}] = useMutation<AddFakeUsers>(ADD_FAKE_USERS_MUTATION,{refetchQueries: [ROOT_QUERY]})

  if (loading) return <p>adding fake users...</p>
  if (error) return <p>Error : {error.message}</p>

  return <button onClick={() => addFakeUsers({ variables: {count: 1} })}>Add Fake Users</button>
}

export default AddFakeUsers
