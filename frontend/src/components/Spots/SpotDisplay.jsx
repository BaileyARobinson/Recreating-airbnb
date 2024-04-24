import { getSpot, getReviewsBySpotId } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './SpotDisplay.css'
import { AiFillStar } from "react-icons/ai"


function DisplaySpot() {
    
    const { spotId } = useParams()

    const spot = useSelector((state) => state.spots.displaySpot)
    const user = useSelector((state) => state.session.user)
    const reviews = useSelector ((state) => state.spots.displayReviews)
    

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(getReviewsBySpotId(spotId))
    }, [dispatch, spotId])

    
    if (spot) {
    const previewImage = spot.SpotImages.find((image) => image.preview === true)
    console.log(spot)

    const convertDate = (date) => {
        const months = [ 
            'January', 
            'Feburary', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December']
        const month = months[date.substring(6,7)]

        return `${month} ${date.substring(0,4)}`
    }

    let date;
    
    return (
        <div className='page'>
        <div className='header'>
            <div><h3>{spot.name}</h3></div>
            <div>{`${spot.city}, ${spot.state}, ${spot.country}`}
        </div>
        </div>
        <div className='previews'>
            <div className="image-display"> 
                <img className='main-image' src={previewImage.url} alt='picture of boat'/>
            </div>
            <div className='four-small-images'>
                {spot.SpotImages.map((image) => { 
                    if (image.preview === false) {
                    return <img className={'small-images'} src={image.url}/>}})}              
                 
           </div>
        </div>
        <div className='description-and-price'>
            <div className='description'>
                <h3>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
                <p>{spot.description}</p>
            </div>
            <div className='reserve-box'>
                <div className='price-stars'>
                    <div>{`$${spot.price} / night`}</div>
                    <div className='star-rating'> <AiFillStar />
                        {spot.avgRating ? Number(spot.avgRating).toFixed(1) : `New`}</div>
                </div>
                <button className='reserve-button' onClick={() => alert('Feature coming soon!')}>Reserve</button>
            </div>             
        </div>

        <hr></hr>
        <div className='reviews'>
            <div className='star-rating'> <AiFillStar />
                {spot.avgRating ? Number(spot.avgRating).toFixed(1) : `New`}<span><span>  -  </span>{`${spot.numReviews} Review`}</span>
            </div>
                <div>{user.id !== spot.ownerId && 
                    <button className='post-button'>Post a Review
                    </button>}
                </div>

        </div>
        
        <div className='reviews'>{reviews ? reviews.Reviews.map((r) => {
            return (<div>
                <div className='reviewer-name'>{r.User.firstName}</div> 
                <div className='review-date'>{convertDate(r.createdAt)}</div>
                <div className='review'>{r.review}</div>
                </div>)
        }): <div></div>}</div>

     </div>
    )
    }
}
    


export default DisplaySpot