import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteASpot } from '../../store/spots';
import './DeleteSpotModal.css'


function DeleteSpot ({spotId}) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()

    const handleDelete = () => {
       
        dispatch(deleteASpot(spotId)).then(()=> closeModal())
    }


    return (
        <div className='container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className='confirm-delete' onClick={handleDelete}>Yes (Delete Spot)</button>
            <button className='stop-delete' onClick={closeModal}> No (Keep Spot) </button>
        </div>
    )
}

export default DeleteSpot