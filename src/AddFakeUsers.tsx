import { gql, useMutation } from '@apollo/client'

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
  const [addFakeUsers, { loading, error }] = useMutation<AddFakeUsers>(ADD_FAKE_USERS_MUTATION, {
    // 7章にてsubscriptionを追加し不要になった
    // update: (caches, { data }) => {
    //   if (!data) return
    //   const cachedUsersData = caches.readQuery<AllUserQuery>({ query: ROOT_QUERY })
    //   if (!cachedUsersData) return
    //   caches.writeQuery({
    //     query: ROOT_QUERY,
    //     data: {
    //       ...cachedUsersData,
    //       totalUsers: cachedUsersData.totalUsers + data.addFakeUsers.length,
    //       allUsers: [...cachedUsersData.allUsers, ...data.addFakeUsers],
    //     },
    //   })
    // },
  })

  if (loading) return <p>adding fake users...</p>
  if (error) return <p>Error : {error.message}</p>

  return <button onClick={() => addFakeUsers({ variables: { count: 1 } })}>Add Fake Users</button>
}

export default AddFakeUsers
