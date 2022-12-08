import './Like.css';

import { BsHeart, BsHeartFill} from 'react-icons/bs'

function Like({ photo, user, handleLike}) {
  return (
    <div className='like'>
        {photo.likes && user && (
            <>
                {photo.likes.includes(user._id) ? (
                    <BsHeartFill />
                ) : (
                    <BsHeart onClick={() => handleLike(photo)} />
                )}
                <p>{photo.likes.length} like(s)</p>
            </>
        )}
    </div>
  )
}

export default Like