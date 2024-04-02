const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');

const { Spot, User, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateCreateSpot} = require ('../../utils/validation')

//get calls

router.get('/', async (req, res) => {

    const getAllSpots = await Spot.findAll()



    const spots =[]

    for (let spot of getAllSpots) {
       
       // const editableSpot = 
       const editableSpot = spot.toJSON()

        //const reviews =[]
        
       let reviews = await Review.findAll({
        where: {
            spotId: spot.id}})

       let totalStars = 0;

       reviews.forEach((review) => totalStars += review.stars)
        
       let avgReview = (totalStars / reviews.length)
       //console.log(avgReview)

        editableSpot.avgReview = avgReview
        
        const image = await SpotImage.findOne({where: {
            spotId: spot.id
        }})

        editableSpot.previewImage = image.url

        spots.push(editableSpot)
    
    }


    res.status(200).json({'Spots': spots})

})

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req

    const currUserSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })
    const cummCurrUserSpots = []

    for (let spot of currUserSpots) {

        editSpot = spot.toJSON()
        console.log(editSpot)
    
    let reviews = await Review.findAll({
        where: {
            spotId: editSpot.id}})

       let totalStars = 0;

       reviews.forEach((review) => totalStars += review.stars)
        
       let avgReview = (totalStars / reviews.length)
       //console.log(avgReview)

       editSpot.avgReview = avgReview
        
        const image = await SpotImage.findOne({where: {
            spotId: editSpot.id
        }})

        editSpot.previewImage = image.url
    
        cummCurrUserSpots.push(editSpot)
    }
    res.json(cummCurrUserSpots)
})

router.get('/:spotId', async (req,res) => {

    const spot = await Spot.findByPk(req.params.spotId, {
        include: 
        [{model: SpotImage, 
            attributes: [
            'id',
            'url',
            'preview' ]}, 
        {model: User,
                 as: "Owner", 
                 attributes: [
                    'id', 
                    'firstName', 
                    'lastName']}]})

    if (spot) {

    const editableSpot = spot.toJSON()

    let reviews = await Review.findAll({
        where: {
            spotId: editableSpot.id}})

    editableSpot.numReviews = reviews.length

       let totalStars = 0;
    
    reviews.forEach((review) => totalStars += review.stars)
        
       let avgReview = (totalStars / reviews.length)
       //console.log(avgReview)

       editableSpot.avgReview = avgReview

    } else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
                    

    res.json(editableSpot)

})

//POST calls

router.post('/', [requireAuth, validateCreateSpot], async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const { user } = req

    

    const newSpot = await Spot.create({
        ownerId: user.toJSON().id,
        address, 
        city, 
        state, 
        country,
        lat, 
        lng,
        name,
        description,
        price

    })
    
    
    res.status(201).json(newSpot)


})

router.post('/:spotId/images', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body
    console.log(spot)
    if(spot) {

        const newSpotImage = await SpotImage.create({

            spotId: req.params.spotId,
            url,
            preview
        })

        const editableSpotImage = newSpotImage.toJSON()
        
        delete editableSpotImage ['createdAt']
        delete editableSpotImage ['updatedAt']
        delete editableSpotImage ['spotId']

        res.json(editableSpotImage)

    } else {
        return res.status(404).json({
        message: "Spot couldn't be found"
        })
    }
})

router.put('/:spotId', [requireAuth, validateCreateSpot], async (req, res) => {

  const spot = await Spot.findByPk(req.params.spotId) 
  
  const { user } = req 

  const {address, city, state, country, lat, lng, name, description, price } = req.body
   
  if (spot.dataValues.ownerId === user.id){

    if (address !== null) spot.address = address
    if (city !== null) spot.city = city
    if (state !== null) spot.state = state
    if (country !== null) spot.country = country
    if (lat !== null) spot.lat = lat
    if (lng !== null) spot.lng = lng
    if (name !== null) spot.name = name
    if (description !== null) spot.description = description
    if (price !== null) spot.price = price

    spot.save()

    res.json(spot)

  } else {
    return res.status(400).json({
        message: "Spot couldn't be found"
    })
  }

  res.json()

})

router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId) 
  
    const { user } = req 
    if (spot){
    if (spot.dataValues.ownerId === user.id) {

        spot.destroy()

        res.json({
            message: "Successfully deleted"
        })
    }
    }   else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
        

})

router.get('/:spotId/reviews', async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId, { include: { model: Review }})

    if (spot) {

       editableSpot = spot.toJSON()
        const reviews = {}
        const reviewArr = []
       for (let review of editableSpot.Reviews) {

            const totalReview = await Review.findByPk(review.id, {include: [ 
                { model:  User , 
                    attributes: [
                        'id', 
                        'firstName', 
                        'lastName']}, { model : ReviewImage, attributes: [
                            'id',
                            'url'
                        ] }] })

            reviewArr.push(totalReview)

       }
       reviews.reviews = reviewArr

        res.json(reviews)

    } else return res.status(404).json({ 
        message: "Spot couldn't be found"
    })

})

// GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT'S ID

router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const { user } = req

    const spot = await Spot.findByPk(req.params.spotId)

  
  if (spot)  {
    if (user.dataValues.id === spot.dataValues.ownerId) {

        const allBookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            }, include: { model: User, 
                attributes: [
                    'id',
                    'firstName',
                    'lastName'
            ]}
        })
        res.json(allBookings)

    } else {

        const allBookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            }, attributes: [
                'spotId',
                'startDate',
                'endDate'
            ]
        })
        res.json(allBookings)
    }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }

})

//CREATE A BOOKING FROM A SPOT BASED ON THE SPOT ID

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { user } = req

    const spot = await Spot.findByPk(req.params.spotId, {include: { model: Booking}})
    console.log(spot.toJSON())

    const { startDate, endDate } = req.body

    if (!spot) {

        return res.status(404).json({
            message: "Spot couldn't be found"
        })

    }

    if (user.dataValues.id !== spot.dataValues.ownerId) {

        //check start and end dates


        const date = new Date()
        if (startDate < date.toISOString()) {
            return res.status(400).json({
                message: "Bad Request",
                error: "startDate cannot be in the past"
            })
        } if (endDate <= startDate) {
            return res.status(400).json({
                message: "Bad Request",
                error: "endDate cannot be on or before startDate"
            })
        }
        //booking conflict 
        
        for (let booking of spot.dataValues.Bookings){
            
            if (startDate >= booking.dataValues.startDate.toISOString() && startDate < booking.dataValues.endDate.toISOString() && endDate > booking.dataValues.startDate.toISOString() && endDate <= booking.dataValues.endDate.toISOString()){
                console.log("I am here")
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                }) 
            }
        

            if (startDate >= booking.dataValues.startDate.toISOString() && startDate < booking.dataValues.endDate.toISOString()) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking"
                    }
                })
            } if (endDate > booking.dataValues.startDate.toISOString() && endDate <= booking.dataValues.endDate.toISOString()) {

                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {endDate: "End date conflicts with an existing booking"}
            })
        }

    }

        const newBooking = await Booking.create({
            spotId: spot.dataValues.id,
            userId: user.dataValues.id,
            startDate,
            endDate
        })
        res.json(newBooking)

    }

})

module.exports = router;