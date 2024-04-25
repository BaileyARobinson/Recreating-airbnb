import { addAnImage, createASpot, updateASpot } from '../../store/spots'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


function SpotForm ({ spot, formType}) {

    const [title, setTitle] = useState(spot?.name)
  const [country, setCountry] = useState(spot?.country)
  const [streetAddress, setStreetAddress] = useState(spot?.address)
  const [city, setCity] = useState(spot?.city)
  const [state, setState] = useState(spot?.state)
  const [description, setDescription] = useState(spot?.description)
  const [price, setPrice] = useState(spot?.price)
  const [previewImage, setPreviewImage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [imageUrl1, setimageUrl1] = useState('')
  const [imageUrl2, setimageUrl2] = useState('')
  const [imageUrl3, setimageUrl3] = useState('')
  const [imageUrl4, setimageUrl4] = useState('')
  const [lat, setLat] = useState(1)
  const [lng, setLng] = useState(1)
  const [errors, setErrors] = useState({})
  
 

  const dispatch = useDispatch() 
  
  
  useEffect(() => {
    const captureErrors = {}
    if (!title) captureErrors.title = 'Name is required'
    if (!country) captureErrors.country = 'Country is required'
    if (!streetAddress) captureErrors.address = 'Address is required'
    if (!city) captureErrors.city = 'City is required'
    if (!state) captureErrors.state = 'State is required'
    if (!price) captureErrors.price = 'Price is required'
    if (description.length < 30) captureErrors.price = 'Description needs a minimum of 30 charachters'
    
        
        if (!previewImage) captureErrors.previewImage = "Preview image is required";

        if (previewImage != null && !(previewImage.includes(".png") ||  
            previewImage.includes(".jpg") ||
            previewImage.includes(".jpeg"))) {
                captureErrors.previewImageType = "Image URL must end in .png, .jpg. or .jpeg"
            }

        if (imageUrl1 != null && !(imageUrl1.includes(".png") ||  
            imageUrl1.includes(".jpg") ||
            imageUrl1.includes(".jpeg"))) {
                captureErrors.imageUrl1 = "Image URL must end in .png, .jpg. or .jpeg"
            }
        if (imageUrl2 != null && !(imageUrl2.includes(".png") ||  
            imageUrl2.includes(".jpg") ||
            imageUrl2.includes(".jpeg"))) {
                captureErrors.imageUrl2 = "Image URL must end in .png, .jpg. or .jpeg"
            }
        if (imageUrl3 != null && !(imageUrl3.includes(".png") ||  
            imageUrl3.includes(".jpg") ||
            imageUrl3.includes(".jpeg"))) {
                captureErrors.imageUrl3 = "Image URL must end in .png, .jpg. or .jpeg"
            }
        if (imageUrl4 != null && !(imageUrl4.includes(".png") ||  
            imageUrl4.includes(".jpg") ||
            imageUrl4.includes(".jpeg"))) {
                captureErrors.imageUrl4 = "Image URL must end in .png, .jpg. or .jpeg"
            }

    setErrors(captureErrors)
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

    if (formType) {

        const createdSpot = await dispatch(createASpot(newSpot))

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

        for (let image of images) {
            await dispatch(addAnImage(image, createdSpot.id))
        }
        navigate(`/spots/${createdSpot.id}`)
    } else {
        
        await dispatch(updateASpot(newSpot, spot.id))

        navigate(`/spots/${spot.id}`)
    }
       
   

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
                <div className='errors'>{submitted && errors.country}</div>
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
                <div className='errors'>{submitted && errors.address}</div>
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
                <div className='errors'>{submitted && errors.city}</div>
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
                <div className='errors'>{submitted && errors.state}</div>
                <div>
                    <h3>Describe your place to a guests</h3>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

                    <textarea 
                        className='Description'
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </div>
                <div className='errors'>{submitted && errors.description}</div>
                <div>
                    <h3>Create a title for you spot</h3>
                    <p>Catch guests attention with a spot title that highlights what makes your space special.</p>

                    <input 
                        className='Title'
                        placeholder='Name'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                </div>
                <div className='errors'>{submitted && errors.title}</div>
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
                <div className='errors'>{submitted && errors.price}</div>
                <div className='photos'>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input 
                        className='preview image'
                        placeholder='preview image'
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        />
                         <div className='errors'>{submitted && errors.previewImage}</div>
                         <div className='errors'>{submitted && errors.previewImageType}</div>
                        <input 
                        className='image URL'
                        placeholder='Image URL'
                        value={imageUrl1}
                        onChange={(e) => setimageUrl1(e.target.value)}
                        />
                         <div className='errors'>{submitted && errors.imageUrl1}</div>
                            <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl2}
                        onChange={(e) => setimageUrl2(e.target.value)}
                            />
                             <div className='errors'>{submitted && errors.imageUrl2}</div>
                            <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl3}
                        onChange={(e) => setimageUrl3(e.target.value)}
                            /> <div className='errors'>{submitted && errors.imageUrl3}</div>
                              <input 
                        className='Image URL'
                        placeholder='Image URL'
                        value={imageUrl4}
                        onChange={(e) => setimageUrl4(e.target.value)}
                            />
                             <div className='errors'>{submitted && errors.imageUrl4}</div>
                </div>
                <button className='submit-spot' >
                {formType}
                </button>

            </form>
        </>
    
    )

}

export default SpotForm