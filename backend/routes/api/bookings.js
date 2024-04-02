const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');

const { Spot, User, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {validateCreateSpot} = require ('../../utils/validation')


//GET ALL OF THE CURRENT USER'S BOOKINGS

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req

    

    const allBookings = await Booking.findAll({ 
       where: {
           userId: user.dataValues.id
        }, include: { model: Spot}
    })

    res.json(allBookings)

})



module.exports = router;