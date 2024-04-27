import {  useDispatch } from 'react-redux'
import {  useState } from 'react'
import { createAReview } from '../../store/reviews'
import { getSpot } from '../../store/spots'
import StarRating from './StarReview'
import { useModal } from '../../context/Modal';
import { useParams } from 'react-router-dom';
import './CreateReviewModal.css'

function CreateReview ({setSubmitted}) {

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})

    
    const { closeModal } = useModal()

    const {spotId} = useParams()
    const dispatch = useDispatch()


    const handleSubmit = async (e) => {
        e.preventDefault()
        await dispatch(getSpot(spotId))

        const reviewData = {
            review,
            stars,
        }
        
        return dispatch(createAReview(reviewData, spotId)).then(() => setSubmitted(true)).then(() => closeModal()).catch(async (res) => {
            const data = await res.json();
            console.log(data)
            if (data?.errors) {
                setErrors(data.errors)
            }
        })
    }
   
    
    return (
        <>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}> 
            <div><span>{errors.reviews}</span><span>{errors.stars}</span> </div> 
            <input className='review' 
            type='text'
            placeholder='Leave your review here...'
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            />
            <StarRating setterStars={setStars} filledStars={stars}/> <div></div>
            <div className='submit-button'> 
                <button disabled={stars < 1 || review?.length < 10 } onClick={handleSubmit}type='submit'>Submit Your Review</button>
            </div><div>{errors.message}</div>
            </form>
            
        </>
    )

}

export default CreateReview