import { deleteAReview } from '../../store/reviews'
import { useModal } from '../../context/Modal'
import {useDispatch} from 'react-redux'

function DeleteReview ({reviewId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = (e) => {
        e.preventDefault()
        closeModal()
        dispatch(deleteAReview(reviewId))
    }

    const dontDelete = (e) => {
        e.preventDefault()
        
    }

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete.then(() => closeModal())}>Yes (Delete Review)</button>
            <button onClick={dontDelete.then(() => closeModal())}> No (Keep Review) </button>
        </>
    )
}


export default DeleteReview