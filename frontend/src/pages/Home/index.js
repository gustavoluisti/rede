
import Like from '../../components/Like';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

import { getPhotos, like } from '../../slices/photoSlice';

import { HomeContainer, NoPhotos } from './styles';

export default function Home() {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getPhotos())
  },[dispatch]);

  const handleLike = (photo) => {
    dispatch(like(photo._id));

    resetMessage()
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <HomeContainer>
      {photos && photos.map(photo =>(
        <div key={photo._id}>
          <PhotoItem photo={photo} />
          <Like photo={photo} user={user} handleLike={handleLike} />
          <Link className='btn' to={`/photos/${photo._id}`}>Ver mais</Link>
        </div>
      ))}
      {photos && photos.length === 0 && (
        <NoPhotos>
          Ainda não há fotos publicadas, <Link to={`/users/${user._id}`}>Clique aqui</Link>
        </NoPhotos>
      )}
    </HomeContainer>
  )
}
