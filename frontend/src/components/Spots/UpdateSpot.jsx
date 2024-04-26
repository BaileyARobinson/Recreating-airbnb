
    import { getSpot} from '../../store/spots'
    import { useEffect } from "react";
    import { useParams} from "react-router-dom";
    import { useSelector, useDispatch } from "react-redux";
    import SpotForm from './SpotForm'
    
    
    function UpdateSpot () {

        const dispatch = useDispatch()
        const { spotId } = useParams()
        
        const spotToBeEdited = useSelector((state) => state.spots.displaySpot)

        useEffect(() => {
            dispatch(getSpot(spotId))
        }, [dispatch, spotId])

        return (

            <SpotForm 
            formType='Update Spot'
            spot={spotToBeEdited}/>
        )
  
    }
    
export default UpdateSpot
