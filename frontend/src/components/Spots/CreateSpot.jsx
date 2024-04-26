import SpotForm from './SpotForm'

import { useSelector} from "react-redux";


function CreateSpot () {

const sessionUser = useSelector((state) => state.session?.user)

console.log(sessionUser)



 const spot = {
    name: '',
    country: '', 
    city: '', 
    state: '', 
    address: '',
    description: '',
    price: '',
    lat: '',
    lng: '',
    previewImage: '',

}
  
    return (
        <>
            <SpotForm
            formType='Create A Spot'
            spot={spot} 
            />

        </>

    )
}


export default CreateSpot