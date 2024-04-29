import { addAnImage, createASpot, updateASpot } from '../../store/spots'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import './SpotForm.css'


function SpotForm ({ spot, formType }) {

    const [title, setTitle] = useState(spot?.name)
    const [country, setCountry] = useState(spot?.country)
    const [streetAddress, setStreetAddress] = useState(spot?.address)
    const [city, setCity] = useState(spot?.city)
    const [state, setState] = useState(spot?.state)
    const [description, setDescription] = useState(spot?.description)
    const [price, setPrice] = useState(spot?.price)
    const [previewImage, setPreviewImage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [imageUrl1, setimageUrl1] = useState()
    const [imageUrl2, setimageUrl2] = useState()
    const [imageUrl3, setimageUrl3] = useState()
    const [imageUrl4, setimageUrl4] = useState()
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
      if (description?.length < 30) captureErrors.description = 'Description needs a minimum of 30 characters'
        
      if (formType === 'Create A Spot') {
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
        }
 
      setErrors(captureErrors)
    }, [title, country, streetAddress, city, state, description, price, previewImage, submitted, imageUrl1, imageUrl2, imageUrl3, imageUrl4, formType])
  
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
          lat: 1,
          lng: 1,
      }
  
      if (formType === 'Create A Spot') {
  
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
                if (image.url) {
              await dispatch(addAnImage(image, createdSpot.id))
            }
          }
          navigate(`/spots/${createdSpot.id}`)
      } else {
          
          await dispatch(updateASpot(newSpot, spot.id))
  
          navigate(`/spots/${spot.id}`)
      }  
    }

    return (
      <div className='form-div'>
       <form className='form-container' onSubmit={(e) => handleSubmit(e)}>
        <h1>{formType}</h1>
        <h3>Where&apos;s your Place Located </h3>
        <p> Guests will only get your exact address once they book a reservation. 
        </p>
        
            <div>
                <label htmlFor='Country'>Country</label> <span className='errors'>{submitted && errors.country}</span>
                <input 
                    className='country'
                    placeholder='Country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    />
            </div>
            
            <div>
                <label htmlFor='Street-Address'>Street Address</label> <span className='errors'>{submitted && errors.address}</span>
                <input 
                    className='street-address'
                    placeholder='Address'
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    />
            </div>
            
            <div className='city-and-state'>
                <div>
                    <label htmlFor='City'>City</label> <span className='errors'>{submitted && errors.city}</span>
                    <input 
                        className='City'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        /><span>{`,`}</span>
                </div>
                
                <div className='state'>
                    <label htmlFor='State'>State</label>  <span className='errors'>{submitted && errors.state}</span>
                    <input 
                        className='State'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        />
                </div>
             </div>

            <hr></hr>

            <div className='describe-to-guests'>
                <h3>Describe your place to a guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

                <textarea 
                    className='Description'
                    placeholder='Please write at least 30 characters'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
            </div>
            <div className='errors'>{submitted && errors.description}</div>

            <hr></hr>

            <div>
                <h3>Create a title for you spot</h3>
                <p>Catch guests attention with a spot title that highlights what makes your space special.</p>

                <input 
                    className='Title'
                    placeholder='Name of your spot
                    '
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
            </div>
            <div className='errors'>{submitted && errors.title}</div>

            <hr></hr>

            <div>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                <span>$</span><input 
                    className='Price per night'
                    placeholder='Price per night (USD)'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
            </div>
            <div className='errors'>{submitted && errors.price}</div>

            <hr></hr>
            {formType === 'Update A Spot' ? <div></div> :
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
            </div> }
            <hr></hr>
            <button className='submit-spot' >
            {formType}
            </button>

    </form>
    </div>

       

    )


}

export default SpotForm
