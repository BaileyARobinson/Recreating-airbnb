import { csrfFetch } from "./csrf"

//action type constants

export const CREATE_REVIEW = 'reviews/CREATE_REVIEW'

//action creators 

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
})

export const createAReview = (newReviewData, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReviewData)
    })
    if (res.ok) {
        const newReview = await res.json()
        dispatch(createReview(newReview))
        return newReview
    } else {
        const errors = await res.json()
        return errors 
    }

}
    
const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_REVIEW: {
            return {...state, ...action.review}
        } default:
        return state
    }
}

export default reviewReducer