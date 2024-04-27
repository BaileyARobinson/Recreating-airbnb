import { getAllSpots } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { AiFillStar } from "react-icons/ai"
import './SpotsIndex.css'
import {useNavigate} from 'react-router-dom'


const SpotsIndex = () =>  {
    
    const [hidden, setHidden] = useState('')

    const spotsInfo = useSelector((state) => state.spots)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const navigate = useNavigate()
    
    

    return (
        <>
        <div className='all-spots'>
        {spotsInfo && Object.values(spotsInfo).map((spot) => (
            <div className="abbreviated-spot" key={spot.id} title={spot.name} onClick={() => {
                navigate(`/spots/${spot.id}`) 
            }} onMouseEnter={() => setHidden(spot.id)} onMouseLeave={() => setHidden('true')}>
                <div className={hidden == spot.id ? 'spot-name' : 'hidden'}>{spot.name}</div>
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
            
        ))}
        </div>
        </>
    )


}

export default SpotsIndex;