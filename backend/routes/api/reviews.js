const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');

const { Spot, User, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { authReviewMustBelongToCurrUser, cannotFindReview} = require('../../utils/helperfunctions')
const {validateCreateReview} = require('../../utils/validation')


//GET ALL REVIEWS OF THE CURRENT USER 

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req
    console.log(user)
    
    const reviews = await Review.findAll({ 
        where: {
            userId: user.dataValues.id,
        }, include: [{model: User, 
            attributes: [
                'id', 
                'firstName',
                'lastName'
            ]},
            { model: Spot,  
                include: { model: SpotImage, 
                    where: {
                        preview: true
                    }
                },
                attributes: 
                { exclude: 
                    ['description','createdAt', 'updatedAt']}, 
                    // include: {model: SpotImage, 
                    //     where: {
                    //       preview: true  
                    // }}}, 
                }, {model: ReviewImage, 
                attributes: 
                    ['id', 'url']}]
    })
    
    const formatedReviews = reviews.map((review) => {

        editableReview = review.toJSON()
        
        if (editableReview.Spot.SpotImages[0]){
        editableReview.Spot.previewImage = editableReview.Spot.SpotImages[0].url
        } else {
            editableReview.Spot.previewImage = null;
            }
       delete editableReview.Spot.SpotImages

        return editableReview


    })

    const finalReviews = {}
    finalReviews.Reviews = formatedReviews
    
    res.json(finalReviews)
})

router.post('/:reviewId/images', [requireAuth, cannotFindReview, authReviewMustBelongToCurrUser ], async (req, res, next) => {

    const { url } = req.body

    const review = await Review.findByPk(req.params.reviewId, {include: { model: ReviewImage}})
    
    if (review.dataValues.ReviewImages.length >= 10) {
        const error = new Error('Maximum number of images for this resource was reached')
        error.status = 403
        next(error)

    } else {
        const image = await ReviewImage.create({
            url,
            reviewId: req.params.reviewId

        })
        editableImage = image.toJSON()
    

        delete editableImage.reviewId
        delete editableImage.createdAt
        delete editableImage.updatedAt
        
        res.json(editableImage)
    }

})

router.put('/:reviewId/', [requireAuth, cannotFindReview, authReviewMustBelongToCurrUser, validateCreateReview], async (req, res, next) => {

    const { review, stars} = req.body

    const reviewToBeEdited = await Review.findByPk(req.params.reviewId)


    reviewToBeEdited.review = review
    reviewToBeEdited.stars = stars

    await reviewToBeEdited.save()

    res.json(reviewToBeEdited)
})

router.delete('/:reviewId', [requireAuth, cannotFindReview, authReviewMustBelongToCurrUser ], async (req, res) => {

    const reviewToBeDeleted = await Review.findByPk(req.params.reviewId)

    await reviewToBeDeleted.destroy()

    res.json({
        message: "Successfully deleted"
    })

})



module.exports = router;