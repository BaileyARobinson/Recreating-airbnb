//action Type Constants

import { csrfFetch } from "./csrf"

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SPOT = 'spots/LOAD_SPOT'
export const CREATE_SPOT = 'spots/CREATE_SPOT'
export const ADD_IMAGE = 'spots/ADD_IMAGE'
export const GET_REVIEWS = 'spots/GET_REVIEWS'

//action creators

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const loadSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
})

export const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

export const addImageToSpot = (image, spotId) => ({
    type: ADD_IMAGE,
    spotId,
    image
})

export const loadAllReviewsForSpot = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

// export const addImageToASpot = (spotId, image)


//THUNK ACTION CREATORS 

export const getAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots')

    if(res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots))
        return spots
    } else {
        const errors = await res.json()
        return errors
    }
}

export const getSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)

    if(res.ok) {
        const spot = await res.json()
        dispatch(loadSpot(spot))
        return spot
    } else {
        const errors = await res.json()
        return errors
    }
}

export const createASpot = (newSpotData) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSpotData)
    }) 
    if (res.ok) {
        const newSpot = await res.json();
        dispatch(createSpot(newSpot))
        return newSpot
      
    } else {
        const errors = await res.json()
        return errors 
    }
}
export const addAnImage = (imageData, spotId) =>  async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(imageData)
    })
    if (res.ok) {
        const newImage = await res.json()
        dispatch(addImageToSpot(newImage))
        return newImage
    } else {
        const errors = await res.json()
        return errors 
    }

}

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, )
    if (res.ok) {
        const reviews = await res.json()
        console.log("=======>",reviews)
        dispatch(loadAllReviewsForSpot(reviews))
        return reviews
    } else {
        const errors = await res.json()
        return errors 
    }
}


//SPOTS REDUCER

const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const spotsState = {}
            action.spots.Spots.forEach((spot) => {
                spotsState[spot.id] = spot
            })
            return spotsState
        } case LOAD_SPOT: {
            return {...state, displaySpot: action.spot}
        } case CREATE_SPOT: {
            return {...state, ...action.spot}
        } case ADD_IMAGE: {
            return {...state, [action.spotId]: [action.image]}
        } case GET_REVIEWS: {
            return {...state, displayReviews: action.reviews}
        }
        default: 
        return state;
    }
}

export default spotsReducer