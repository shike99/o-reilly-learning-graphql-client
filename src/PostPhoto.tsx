import { gql, useMutation } from '@apollo/client'
import { FormEventHandler, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AllUserQuery, PhotoQuery, ROOT_QUERY } from './App'

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      id
      name
      url
    }
  }
`

interface PostPhotoMutation {
  postPhoto: PhotoQuery
}

function PostPhoto() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('PORTRAIT')
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate()
  const [postPhoto] = useMutation<PostPhotoMutation>(POST_PHOTO_MUTATION, {
    update: (cache, { data }) => {
      if (!data) return

      const cachedData = cache.readQuery<AllUserQuery>({ query: ROOT_QUERY })
      if (!cachedData) return

      cache.writeQuery<AllUserQuery>({
        query: ROOT_QUERY,
        data: {
          ...cachedData,
          allPhotos: [data.postPhoto, ...cachedData.allPhotos],
        },
      })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    await postPhoto({ variables: { input: { name, description, category, file } } }).catch(console.error)
    navigate('/')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}
    >
      <h1>Post a Photo</h1>
      <input
        type="text"
        style={{ margin: '10px' }}
        placeholder="photo name..."
        value={name}
        onChange={({ target }) => setName(target.value)}
      />
      <input
        type="text"
        style={{ margin: '10px' }}
        placeholder="photo description..."
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
      <select value={category} style={{ margin: '10px' }} onChange={({ target }) => setCategory(target.value)}>
        <option value="PORTRAIT">PORTRAIT</option>
        <option value="LANDSCAPE">LANDSCAPE</option>
        <option value="ACTION">ACTION</option>
        <option value="GRAPHIC">GRAPHIC</option>
      </select>
      <input
        type="file"
        style={{ margin: '10px' }}
        accept="image/jpeg"
        onChange={({ target }) => setFile(target.files && target.files.length ? target.files[0] : null)}
      />
      <div style={{ margin: '10px' }}>
        <button>Post Photo</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default PostPhoto
