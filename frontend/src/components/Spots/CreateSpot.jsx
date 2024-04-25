import { SpotForm } from './SpotForm'

import { useSelector} from "react-redux";


function CreateSpot () {

const sessionUser = useSelector((state) => state.session?.user)

console.log(sessionUser)
if (sessionUser) {
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
    iamgeUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: ''


 }
}
  
    return (
        <>
            <SpotForm
            formType='CreateSpot'
            spot={spot} />

        </>

    )
}


export default CreateSpot