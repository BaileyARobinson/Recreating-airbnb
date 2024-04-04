const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');



const { Spot, User, Booking, Review, ReviewImage, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { cannotFindSpotImage, authSpotBelongToUserFromSpotImg } = require('../../utils/helperfunctions')
//DELETE A SPOT IMAGE

router.delete('/:imageId', [requireAuth, cannotFindSpotImage, authSpotBelongToUserFromSpotImg, authSpotBelongToUserFromSpotImg, ], async (req, res) => {

    const spotImage = await SpotImage.findByPk(req.params.imageId)

    await spotImage.destroy()

    res.json({message: 'Successfully Deleted'})
})

module.exports = router;