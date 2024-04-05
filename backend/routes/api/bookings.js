const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');

const { Spot, User, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateCreateSpot} = require ('../../utils/validation')
const {checkBookings,validateBookingDates, authBookingMustBelongToCurrentUser, authBookingOrSpotBelongsToCurrUser, findBookingWithId} = require ('../../utils/helperfunctions')


//GET ALL OF THE CURRENT USER'S BOOKINGS

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req

    

    const allBookings = await Booking.findAll({ 
       where: {
           userId: user.dataValues.id
        }, include: { model: Spot}
    })

    const resultObj = {}
    resultObj.Bookings = allBookings
    res.json(resultObj)

})

//EDIT A BOOKING 

router.put('/:bookingId', [requireAuth, findBookingWithId, authBookingMustBelongToCurrentUser, validateBookingDates], async (req, res, next) => {

    const  booking  = await Booking.findByPk(req.params.bookingId)

    const {startDate, endDate} = req.body

    const allBookings = await Booking.findAll()

    const results = allBookings.map((eachBooking) => {

        return checkBookings(startDate, endDate, eachBooking)
    })
    
    
    const error = results.find((result) => {
        return result !== null
    })
   
    if (error) {
        next(error)
    } else {

    booking.dataValues.startDate = startDate
    booking.dataValues.endDate = endDate
    
    await booking.save()

    res.json(booking)
    }

})

router.delete('/:bookingId', [requireAuth, findBookingWithId, authBookingOrSpotBelongsToCurrUser], async (req, res, next) => {

    const date = new Date()

    const booking = await Booking.findByPk(req.params.bookingId)
    

    if (date.toISOString() >= booking.dataValues.startDate.toISOString() && date.toISOString <= booking.dataValues.endDate.toISOString() ) {
        const error = new Error("Bookings that have been started can't be deleted")
        error.status = 403
        next(error)
    } else {
        await booking.destroy()
        res.json('Successfully deleted')
    }
    

    

})



module.exports = router;