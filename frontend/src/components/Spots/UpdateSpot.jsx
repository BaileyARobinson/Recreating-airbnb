
    import { updateASpot , getSpot} from '../../store/spots'
    import { useState, useEffect } from "react";
    import { useNavigate , useParams} from "react-router-dom";
    import { useSelector, useDispatch } from "react-redux";
    
    
    function UpdateSpot () {

        const dispatch = useDispatch()
        const { spotId } = useParams()
        
        const spotToBeEdited = useSelector((state) => state.spots.displayspot)

        
       
  
    }
    
export default UpdateSpot
