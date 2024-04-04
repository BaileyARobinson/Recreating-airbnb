const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');



const { Spot, User, Booking, Review, ReviewImage, SpotImage, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { authRevBelongToUserFromRevImg, cannotFindReviewImage } = require('../../utils/helperfunctions')

//DELETE A REVIEW IMAGE

router.delete('/:imageId', [requireAuth, cannotFindReviewImage, authRevBelongToUserFromRevImg, ], async (req, res) => {

    const reviewImage = await ReviewImage.findByPk(req.params.imageId)

    await reviewImage.destroy()

    res.json({message: 'Successfully Deleted'})
})



module.exports = router;