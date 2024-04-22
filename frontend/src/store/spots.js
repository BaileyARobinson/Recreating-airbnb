//action Type Constants

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'


//action creators

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

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

//SPOTS REDUCER

const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const spotsState = {}
            action.spots.Spots.forEach((spot) => {
                spotsState[spot.id] = spot
            })
            return spotsState
        } 
        default: 
        return state;
    }
}

export default spotsReducer