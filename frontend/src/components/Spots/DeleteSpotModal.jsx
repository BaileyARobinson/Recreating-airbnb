import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteASpot } from '../../store/spots';


function DeleteSpot ({spotId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = (e) => {
       
        dispatch(deleteASpot(spotId)).then(()=> closeModal())
    }


    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={closeModal}> No (Keep Spot) </button>
        </>
    )
}

export default DeleteSpot