const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');



const { Spot, User, Booking, Review, ReviewImage, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateCreateSpot, validateCreateReview} = require ('../../utils/validation');
const {getAvgReview, checkBookings, validateBookingDates, authSpotMustBelongToCurrentUser, authSpotCannotBelongToCurrentUser, checkIfSpotExists, checkPageAndSize} = require ('../../utils/helperfunctions')

//get calls

router.get('/', checkPageAndSize, async (req, res, next) => {

    let { page , size } = req.query

    const pagination = {}

    if (page && size) {
  

        page = parseInt(page)
        size = parseInt(size)
        
        if (isNaN(page) || page < 0 || page > 10) page = 1
        if (isNaN(page) || size < 0 || size > 20) size = 20

        pagination.limit = size;
        pagination.offset = size * (page - 1)

    }
    console.log(pagination)

    const getAllSpots = await Spot.findAll({  
        include: [ { model: Review}, { model: SpotImage}],
        ...pagination
     })

    const results = []
    for (let spot of getAllSpots) {

        const avgReview = getAvgReview(spot.dataValues.Reviews)

        const editableSpot = spot.toJSON()

        editableSpot.avgRating = avgReview 
        
        if (spot.dataValues.SpotImages[0]) {
        const previewImageURL = spot.dataValues.SpotImages[0].dataValues.url
        editableSpot.previewImage = previewImageURL
        } else {
            editableSpot.previewImage = null
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
        console.log(editSpot)
    
    let reviews = await Review.findAll({
        where: {
            spotId: editSpot.id}})

       let totalStars = 0;

       reviews.forEach((review) => totalStars += review.stars)
        
       let avgReview = (totalStars / reviews.length)
       //console.log(avgReview)

            editSpot.avgRating = avgReview
        
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

router.get('/:spotId', checkIfSpotExists, async (req, res, next) => {

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
    

    const editableSpot = spot.toJSON()

    let reviews = await Review.findAll({
        where: {
            spotId: editableSpot.id}})

    editableSpot.numReviews = reviews.length

       let totalStars = 0;
    
    reviews.forEach((review) => totalStars += review.stars)
        
       let avgReview = (totalStars / reviews.length)
       //console.log(avgReview)

       editableSpot.avgStarRating = avgReview

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

router.post('/:spotId/images', [requireAuth, checkIfSpotExists, authSpotMustBelongToCurrentUser], async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)
    const { url, preview } = req.body
    

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


})

router.put('/:spotId', [requireAuth, checkIfSpotExists, authSpotMustBelongToCurrentUser, validateCreateSpot], async (req, res, next) => {

  const spot = await Spot.findByPk(req.params.spotId) 
  
  const { user } = req 

  const {address, city, state, country, lat, lng, name, description, price } = req.body
   

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

})

router.delete('/:spotId', [requireAuth, checkIfSpotExists, authSpotMustBelongToCurrentUser], async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId) 
  
    const { user } = req 
    
    if (spot.dataValues.ownerId === user.id) {

        spot.destroy()

        res.json({
            message: "Successfully deleted"
        })
    }
        

})

// Get all Reviews by a Spot's id

router.get('/:spotId/reviews', checkIfSpotExists, async (req, res, next) => {

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

router.post('/:spotId/reviews', [requireAuth, checkIfSpotExists, validateCreateReview], async (req, res, next) => {

    const { user } = req

    const { review, stars} = req.body

    const spot = await Spot.findByPk(req.params.spotId,
        {include: { model: Review}})

        let userHasNotWrittenReview = true
        spot.dataValues.Reviews.forEach((review) => {

            if (review.dataValues.userId === user.dataValues.id) {
                userHasNotWrittenReview = false
                const error = new Error('User already has a review for this spot')
                error.status = 500
                next(error)
            } 

        })
        if (userHasNotWrittenReview){
            const newReview = await Review.create({
            spotId: req.params.spotId,
            userId: user.dataValues.id,
            review, 
            stars
        })
        res.status(201).json(newReview)

    }
        

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

        const resultsObj = {}
            resultsObj.Bookings = allBookings
        

        res.json(resultsObj)

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
        const resultsObj = {}
            resultsObj.Bookings = allBookings
        

        res.json(resultsObj)
    }

})

//CREATE A BOOKING FROM A SPOT BASED ON THE SPOT ID

router.post('/:spotId/bookings', [requireAuth, checkIfSpotExists, authSpotCannotBelongToCurrentUser, validateBookingDates], async (req, res, next) => {
    const { user } = req

    const spot = await Spot.findByPk(req.params.spotId, {include: { model: Booking}})
    

    const { startDate, endDate } = req.body


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

        const results = spot.dataValues.Bookings.map((eachBooking) => {

            return checkBookings(startDate, endDate, eachBooking)
        })
        
        
        const error = results.find((result) => {
            return result !== null
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

    }
})

module.exports = router;