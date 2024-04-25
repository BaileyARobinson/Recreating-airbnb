import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteASpot } from '../../store/spots';


function DeleteSpot ({spotId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(deleteASpot(spotId)).then(closeModal)
    }

    const dontDelete = (e) => {
        e.preventDefault()
        closeModal()
    }

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={dontDelete}> No (Keep Spot) </button>
        </>
    )
}

export default DeleteSpot