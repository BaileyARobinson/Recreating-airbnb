import { csrfFetch } from "./csrf"

//action type constants

export const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW'

//action creators 

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
})

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
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

export const deleteAReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }) 
    if (res.ok) {
        dispatch(deleteReview(reviewId))
        return res.json({message: 'Successfully deleted'})
    } else {
        const errors = await res.json()
        return errors
    }
}

// REDUCER
    
const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_REVIEW: {
            return {...state, ...action.review}
        } case DELETE_REVIEW: {
            const newState = {...state}
            delete newState[action.reportId]
            return newState
        } 
        default:
        return state
    }
}


export default reviewReducer