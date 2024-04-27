import { deleteAReview } from '../../store/reviews'
import { getReviewsBySpotId } from '../../store/spots'
import { useModal } from '../../context/Modal'
import {useDispatch} from 'react-redux'

function DeleteReview ({reviewId, spotId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = async () => {
        
        await  dispatch(deleteAReview(reviewId))
        await dispatch(getReviewsBySpotId(spotId))
        closeModal()
    }


    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete}>Yes (Delete Review)</button>
            <button onClick={closeModal}> No (Keep Review) </button>
        </>
    )
}


export default DeleteReview