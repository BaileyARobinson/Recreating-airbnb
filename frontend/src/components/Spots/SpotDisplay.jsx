import { getSpot, getReviewsBySpotId } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './SpotDisplay.css'
import { AiFillStar } from "react-icons/ai"
import OpenModalButton from '../OpenModalButton'
import CreateReview from '../Reviews/CreateReviewModal'
import DeleteReview from '../Reviews/DeleteReviewModal'


function DisplaySpot() {
    
    const { spotId } = useParams()


    const spot = useSelector((state) => state.spots.displaySpot)
    const user = useSelector((state) => state.session.user)
    const reviews = useSelector ((state) => state.spots.displayReviews)

    const [submitted, setSubmitted] = useState(false)
    

    const dispatch = useDispatch()

  

    useEffect(() => {
        dispatch(getReviewsBySpotId(spotId))
        dispatch(getSpot(spotId))
    }, [dispatch, spotId, submitted])

    console.log(submitted)

    if (spot) {
    const previewImage = spot.SpotImages.find((image) => image.preview === true)

    const convertDate = (date) => {
        const months = [
            '', 
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
                    return <img key={image.id} className={'small-images'} src={image.url}/>}})}              
                 
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
                        {(spot.avgStarRating !== null) ? (spot.numReviews === 1) ? `${Number(spot.avgStarRating).toFixed(1)} • ${spot.numReviews} review` :`${Number(spot.avgStarRating).toFixed(1)} •  ${spot.numReviews} reviews`  : ` New ` }</div>
                </div>
                <button className='reserve-button' onClick={() => alert('Feature coming soon!')}>Reserve</button>
            </div>             
        </div>

        <hr></hr>
        <div className='reviews'>
            <div className='star-rating'> <AiFillStar />
                {spot.avgStarRating > 0 ? Number(spot.avgStarRating).toFixed(1) : `New`}<span>{`  •  `}</span>  {+spot.numReviews === 1 ? `${spot.numReviews} Review` : `${spot.numReviews} Reviews`}
            </div> {user?.id > 0 ? 
                <div>{user?.id !== spot.ownerId && 
                    <OpenModalButton 
                    buttonText='Post a Review'
                    modalComponent={<CreateReview setSubmitted={setSubmitted}/>}
                    />}
                </div> : <div></div>
                }

        </div>
        
        <div className='reviews'>{ Number(spot.numReviews) > 0 ? 
        reviews?.Reviews.toReversed().map((r) => {
            return (<div key={r.id}>
                <div className='reviewer-name'>{r.User.firstName}</div> 
                <div className='review-date'>{convertDate(r.createdAt)}</div>
                <div className='review'>{r.review}</div>
                {r.User?.id === user?.id ? <OpenModalButton buttonText='Delete' modalComponent={<DeleteReview reviewId={r.id} spotId={spotId}/>}/> : <span></span>}
                </div>)

        }) : user?.id === spot?.ownerId ? <div></div> : <div>Write the first review.</div> }
        </div>

     </div>
    )
    }
}
    


export default DisplaySpot