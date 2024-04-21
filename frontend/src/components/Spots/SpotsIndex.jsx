import { getAllSpots } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { AiFillStar } from "react-icons/ai"
import './SpotsIndex.css'

const SpotsIndex = () =>  {
    
    
    const spotsInfo = useSelector((state) => state.spots.Spots)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    
    console.log(spotsInfo)

    return (
        <>
        <h2>Spots</h2>
        <div className='all-spots'>
        {spotsInfo && spotsInfo.map((spot) => (
            <div className="abbreviated-spot">
                <img className="thumbnail" src={spot.previewImage} alt='thumbnail of boat'/>
                <div className='bottom-text'> 
                    <div>
                        <p>{`${spot.city}, ${spot.state}`}</p>
                        <p>{`$${spot.price} night`}</p>
                    </div>
                        <AiFillStar />
                        <p>{Number(spot.avgRating).toFixed(1)}</p>
                    <div>
                        
                    </div>
                </div>

            </div>
            
        ))}
        </div>
        </>
    )


}

export default SpotsIndex;