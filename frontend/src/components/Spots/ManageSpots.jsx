import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsersSpots } from "../../store/spots";
import { AiFillStar } from "react-icons/ai"
import OpenModalButton from '../OpenModalButton'
import DeleteSpot from './DeleteSpotModal'
import './ManageSpots.css'


function ManageSpots () {

    const [hidden, setHidden] = useState('')

    const spots = useSelector((state) => state.spots.userSpots)
    const dispatch = useDispatch()

    useEffect (() => {
        dispatch(getUsersSpots())
    }, [dispatch])

    const navigate = useNavigate()

    function createANewSpot () {
        navigate('/spots/new')
    }
    

return (
    <div>
        <h1>Manage Your Spots</h1> 
        <button onClick={createANewSpot}>Create a New Spot</button>
        <div className='all-spots'>
        {spots && spots.Spots.map((spot) => (
            <div className="abbreviated-spot" key={spot.id} title={spot.name} onMouseEnter={() => setHidden(spot.id)} onMouseLeave={() => setHidden('true')}>
                <div className={hidden == spot.id ? 'spot-name' : 'hidden'}>{spot.name}</div>
                <div className='click-through' onClick={() => {navigate(`/spots/${spot.id}`) }} >
                    <img className="thumbnail"  src={spot.previewImage} alt='thumbnail of boat'/>
                    <div className='bottom-text'> 
                        <div className='bottom-left-text'>
                            <p fontWeight='bold' >{`${spot.city}, ${spot.state}`}</p>
                            <span className='star-rating'> <AiFillStar />
                            {spot.avgRating ? Number(spot.avgRating).toFixed(1) : `New`}</span>
                        </div>
                        <p>{`$${spot.price} night`}</p>
                    </div>
                </div>
                    <div className='bottom-buttons'> 
                        <button onClick={() => navigate(`/spots/${spot.id}/update`)}>Update</button>
                        <OpenModalButton 
                            buttonText='Delete'
                            modalComponent={<DeleteSpot spotId={spot.id}/>}
                    />
                    </div>
                
                </div>
            
        ))}
        </div>
    </div>   
)

}

export default ManageSpots