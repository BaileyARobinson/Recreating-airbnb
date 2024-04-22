import { getAllSpots } from "../../store/spots"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


function DisplaySpot() {
    
    const { spotId } = useParams()

    console.log('user params spotId', spotId)
    
    const spot = useSelector((state) => state.spots[spotId])

   console.log('spots', spot)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    // let spotToDisplay;
    // if (spots) {
    //     console.log('hello')
    // spotToDisplay = spots.find((spot) => {
    //     console.log('spotid',spot.id)
    //     +spot.id === +spotId})
    // }
    // console.log('spotToDisplay', spotToDisplay)

    return (
        <div>
        {spot?.name}
        </div>
    )

}

export default DisplaySpot