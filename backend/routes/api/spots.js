const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');



const { Spot, User, Booking, Review, ReviewImage, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateCreateSpot, validateCreateReview} = require ('../../utils/validation');
const {getAvgReview, checkBookings, validateBookingDates, authSpotMustBelongToCurrentUser, authSpotCannotBelongToCurrentUser, checkIfSpotExists, cannotFindSpot} = require ('../../utils/helperfunctions')

//get calls

router.get('/', async (req, res) => {

    let { page , size } = req.query

    pagination = {}

    if (page && size) {

        page = parseInt(page)
        size = parseInt(size)

        
        if (isNaN(page) || page < 0 || page > 10) page = 1
        if (isNaN(page) || size < 0 || size > 20) size = 20

        pagination.limit = size;
        pagination.offset = size * (page - 1)

    }

    const getAllSpots = await Spot.findAll({  
        include: [ { model: Review}, { model: SpotImage}],
        ...pagination
     })
    const results = []
    for (let spot of getAllSpots) {

        const avgReview = getAvgReview(spot.dataValues.Reviews)

        const editableSpot = spot.toJSON()

        editableSpot.avgReview = avgReview 
        
        if (spot.dataValues.SpotImages[0]) {
        const previewImageURL = spot.dataValues.SpotImages[0].dataValues.url
        editableSpot.previewImage = previewImageURL
        }

        delete editableSpot.Reviews
        delete editableSpot.SpotImages

        results.push(editableSpot)
    }

    const resultsObj = {}
    resultsObj.Spots = results

    res.json(resultsObj)

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

    
    let reviews = await Review.findAll({
        where: {
            spotId: editSpot.id}})
        
        let avgReview;
       if (reviews.length) { 
            avgReview = getAvgReview(reviews)
       } else {
            avgReview = null}

            editSpot.avgReview = avgReview
        
        const image = await SpotImage.findOne({where: {
            spotId: editSpot.id
        }})
        if (image) {
        editSpot.previewImage = image.dataValues.url
        }
    
        cummCurrUserSpots.push(editSpot)
    }
    const formattedResults = {}
    formattedResults.Spots = cummCurrUserSpots
    res.json(formattedResults)
})

//Get details of a Spot from an Id

router.get('/:spotId', async (req, res, next) => {

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
    
    let avgReview;
    if (reviews.length) {
        avgReview = getAvgReview(reviews)
    } else {
        avgReview = null
    }

       editableSpot.avgReview = avgReview

       res.json(editableSpot)

    } else {
        const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)
    }
    

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

router.post('/:spotId/images', [requireAuth, authSpotMustBelongToCurrentUser], async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body
    
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
        const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)

    }
})

router.put('/:spotId', [requireAuth, authSpotMustBelongToCurrentUser, validateCreateSpot], async (req, res, next) => {

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
    const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)
  }

})

router.delete('/:spotId', [requireAuth, authSpotMustBelongToCurrentUser], async (req, res, next) => {

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
        const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)
    }
        

})

// Get all Reviews by a Spot's id

router.get('/:spotId/reviews', cannotFindSpot, async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId, { include: { model: Review }})

    console.log(spot)
    const reviewArr = [];
    const reviews = {};
    if (spot.dataValues.Reviews.length) {

       editableSpot = spot.toJSON()
        
        
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
       
    }
    reviews.Reviews = reviewArr

        res.json(reviews)
    
});

//CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID

router.post('/:spotId/reviews', [requireAuth, validateCreateReview, checkIfSpotExists], async (req, res, next) => {

    const { user } = req

    const { review, stars} = req.body

    const spot = await Spot.findByPk(req.params.spotId,
        {include: { model: Review}})

        spot.dataValues.Reviews.forEach((review) => {

            if (review.dataValues.userId === user.dataValues.id) {
                const error = new Error('User already has a review for this spot')
                error.status = 500
                next(error)
            } 

        })
        const newReview = await Review.create({
            spotId: req.params.spotId,
            userId: user.dataValues.id,
            review, 
            stars
        })
        res.json(newReview)
        

})

// GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT'S ID

router.get('/:spotId/bookings', [requireAuth, cannotFindSpot], async (req, res, next) => {

    const { user } = req

    const spot = await Spot.findByPk(req.params.spotId)

  
  
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

})

//CREATE A BOOKING FROM A SPOT BASED ON THE SPOT ID

router.post('/:spotId/bookings', [requireAuth, authSpotCannotBelongToCurrentUser, validateBookingDates], async (req, res, next) => {
    const { user } = req

    const spot = await Spot.findByPk(req.params.spotId, {include: { model: Booking}})
    console.log(spot.toJSON())

    const { startDate, endDate } = req.body

    if (!spot) {

        const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)

    }
    
        const bookingConflicts = spot.dataValues.Bookings.map((eachBooking) => {

        return checkBookings(startDate, endDate, eachBooking)
        }) 

        const error = bookingConflicts.find((conflict) => {
        return conflict !== null
        })
       
        if (error) {
            next(error)

    } else {

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