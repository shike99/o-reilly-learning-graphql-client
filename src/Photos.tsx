import { useQuery } from '@apollo/client'
import { AllUserQuery, ROOT_QUERY } from './App'

function Photos() {
  const { data, loading, error } = useQuery<AllUserQuery>(ROOT_QUERY)

  if (loading) return <p>loading photos....</p>
  if (error) return <p>Photo Error: {error.message}</p>

  return (
    <div>
      {data?.allPhotos.map((photo) => (
        <img key={photo.id} src={photo.url} alt={photo.name} width={350} />
      ))}
    </div>
  )
}

export default Photos
