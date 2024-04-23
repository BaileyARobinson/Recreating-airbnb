import { addAnImage, createASpot } from '../../store/spots'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


function CreateSpot () {

const [title, setTitle] = useState('')
  const [country, setCountry] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [imageUrl1, setimageUrl1] = useState('')
  const [imageUrl2, setimageUrl2] = useState('')
  const [imageUrl3, setimageUrl3] = useState('')
  const [imageUrl4, setimageUrl4] = useState('')
  const [lat, setLat] = useState(1)
  const [lng, setLng] = useState(1)
 

  const dispatch = useDispatch()

  //const sessionUser = useSelector((state) => state.session.user)
  
  
  useEffect(() => {


  }, [title, country, streetAddress, city, state, description, price, previewImage, submitted])

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    const newSpot = { 
        name: title,
        description,
        country,
        address: streetAddress,
        city,
        state,
        price,
        lat,
        lng,
    }
    const images = [{
        url: previewImage,
        preview: true
    }, 
    {
        url: imageUrl1,
        preview: false,
    },
    {
        url: imageUrl2,
        preview: false
    },
    {
        url: imageUrl3,
        preview: false
    },
    {
        url: imageUrl4,
        preview: false
    }]



    const createdSpot = await dispatch(createASpot(newSpot))
    
    images.forEach( async (image) => { 
        if (image.url.length > 0) {
        await dispatch(addAnImage(image, createdSpot.id))
        }
    })
       
    navigate(`/spots/${createdSpot.id}`)

}

    return (
        <>
            <h1>Create a Spot</h1>
            <h3>Where's your Place Located </h3>
            <h5> Guests will only get your exact address once they book a reservation. 
            </h5>
            <form className='form-container' onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label htmlFor='Country'>Country</
                    label> 
                    <input 
                        className='Country'
                        placeholder='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor='Street-Address'>Street Address</
                    label> 
                    <input 
                        className='street-address'
                        placeholder='Address'
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor='City'>City</
                    label> 
                    <input 
                        className='City'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        />
                </div>
                <div>
                    <label htmlFor='State'>State</
                    label> 
                    <input 
                        className='State'
                        placeholder='STATE'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        />
                </div>
                <div>
                    <h3>Describe your place to a guests</h3>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

                    <input 
                        className='Description'
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </div>
                <div>
                    <h3>Create a title for you spot</h3>
                    <p>Catch guests attention with a spot title that highlights what makes your space special.</p>

                    <input 
                        className='Title'
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                </div>
                <div>
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                    <input 
                        className='Price per night'
                        placeholder='Price per night'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                </div>
                <div className='photos'>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input 
                        className='preview image'
                        placeholder='preview image'
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        <input 
                        className='image URL'
                        placeholder='Image URL'
                        value={imageUrl1}
                        onChange={(e) => setimageUrl1(e.target.value)}
                        />
                            <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl2}
                        onChange={(e) => setimageUrl2(e.target.value)}
                            />
                            <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl3}
                        onChange={(e) => setimageUrl3(e.target.value)}
                            />
                              <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl4}
                        onChange={(e) => setimageUrl4(e.target.value)}
                            />
                </div>
                <button className='submit-spot' >
                Create Spot
                </button>

            </form>
        </>

    )
}


export default CreateSpot