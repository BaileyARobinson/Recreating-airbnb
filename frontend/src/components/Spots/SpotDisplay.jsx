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

    const previewImage = spot.SpotImages.find((image) => image.preview === true)
    return (
        
        <div className='image-display'>
        
            <img className='main-image' src={previewImage.url} alt='picture of boat'/>
            {/* <div className='4-small-images'>
                {spot.spotImages.map((image) => { 
                    return <img className='small-image' src={image.url})}}               
                 
           </div> */}
        </div>
       
    )

    }
}

export default DisplaySpot