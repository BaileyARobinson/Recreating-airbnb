import { deleteAReview } from '../../store/reviews'
import { getReviewsBySpotId, getSpot } from '../../store/spots'
import { useModal } from '../../context/Modal'
import {useDispatch} from 'react-redux'

function DeleteReview ({reviewId, spotId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        
        await  dispatch(deleteAReview(reviewId))
        await dispatch(getReviewsBySpotId(spotId))
        await dispatch(getSpot(spotId))
        closeModal()
    }


    return (
        <div className='container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button className='confirm-delete' onClick={handleDelete}>Yes (Delete Review)</button>
            <button className='stop-delete' onClick={closeModal}> No (Keep Review) </button>
        </div>
    )
}


export default DeleteReview