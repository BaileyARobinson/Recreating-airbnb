import { getSpot } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


function DisplaySpot() {
    
    const { spotId } = useParams()

    const spot = useSelector((state) => state.spots)

    console.log(spot)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [dispatch, spotId])

    if (Object.values(spot).length !== 0) {
    return (
        
        <div className='image-display'>
        
            <img className='main-image' src={spot.SpotImages[0]} alt='picture of boat'/>
            <div className='4-small-images'>
                <img src={spot.SpotImages[1]} alt='picture of boat'/>
                 <img src={spot.SpotImages[2]} alt='picture of boat'/>
                 <img src={spot.SpotImages[3]} alt='picture of boat'/>
                 <img src={spot.SpotImages[4]} alt='picture of boat'/>
                 
           </div>
        </div>
       
    )

    }
}

export default DisplaySpot