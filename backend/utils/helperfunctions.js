//Helper functions 

const { Spot, User, Booking, Review, ReviewImage, SpotImage } = require('.././db/models');

function getAvgReview(array) {

    const total = array.reduce((acc, curr) => {
            
        return acc + curr.dataValues.stars 

    }, 0)


    const avgReview = total/array.length

    return avgReview

}

function checkBookings(startDate, endDate, booking) {

    const bookingStartDate = booking.dataValues.startDate.toISOString().substring(0,10)
    const bookingEndDate = booking.dataValues.endDate.toISOString().substring(0,10)
    
    

    // start date and end date between booking
    if (startDate >= bookingStartDate && startDate <= bookingEndDate && endDate >= bookingStartDate && endDate <= bookingEndDate){
            
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }, error.status = 403
        return error
        // start date and end date contain existing booking    
    } else if (startDate <= bookingStartDate && endDate >= bookingEndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }, error.status = 403
        return error

    } 


    else if (startDate >= bookingStartDate && startDate <= bookingEndDate) {
        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
        }, error.status = 403
        return error
        
    } else if (endDate >= bookingStartDate && endDate <= bookingEndDate) {

        const error = new Error("Sorry, this spot is already booked for the specified dates")
        error.errors = {
            endDate: "End date conflicts with an existing booking"
        }, error.status = 403
        return error
    } else {
        return null

    }

        
}



const validateBookingDates = async (req, res, next) => {

    const {startDate, endDate} = req.body

    if (startDate === null) {
        const error = new Error("Start date required")
        error.status = 400
        next(error)
    }
    if (endDate === null) {
        const error = new Error("End date required")
        error.status = 400
        next(error)
    }

    const date = new Date()
    if (startDate < date.toISOString()) {
        const err = new Error("Bad Request")
        err.errors = "startDate cannot be in the past"
        err.status = 400
        next(err)
        
    
    } if (endDate <= startDate) {
        const err = new Error("Bad Request")
        err.errors = "endDate cannot be on or before startDate"
        err.status = 400
        next (err)
        

    } else next()

}

const authSpotMustBelongToCurrentUser = async (req, res, next) => {

    const { user } = req
   
    const spot = await Spot.findByPk(req.params.spotId)


    if(user.dataValues.id !== spot.dataValues.ownerId) {
        const error = new Error('Require proper authorization')
        error.status = 403
        next(error)
    } else (
        next()
    )
}

const authSpotCannotBelongToCurrentUser = async (req, res, next) => {

    const { user } = req
   
    const spot = await Spot.findByPk(req.params.spotId)


    if(user.dataValues.id === spot.dataValues.ownerId) {
        const error = new Error('Require proper authorization')
        error.status = 403
        next(error)
    } else (
        next()
    )
}

const authBookingMustBelongToCurrentUser = async (req, res, next) => {

    const { user } = req
    
    const booking = await Booking.findByPk(req.params.bookingId)
    

    if(user.dataValues.id !== booking.dataValues.userId) {
        const error = new Error('Require proper authorization')
        error.status = 403
        next(error)
    } else (
        next()
    )
}

const authBookingOrSpotBelongsToCurrUser = async (req,res,next) => {  
    const { user } = req
    
    const booking = await Booking.findByPk(req.params.bookingId, {include: {model:Spot}})

    if(user.dataValues.id === booking.dataValues.userId || user.dataValues.id === booking.dataValues.Spot.dataValues.ownerId) {
        next()
        
    } else {
        const error = new Error('Require proper authorization')
        error.status = 403
        next(error)
    }
    
}

const findBookingWithId = async (req, res, next) => {

    const booking = await Booking.findByPk(req.params.bookingId)

    if (booking) {
        next()
    } else {
        const error = new Error("Booking couldn't be found")
        error.status = 404
        next(error)
    }

}

const checkIfSpotExists = async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)

    if (spot) next()
    else {
        const error = new Error("Spot couldn't be found")
        error.status = 404
        next(error)
    }
}

const authReviewMustBelongToCurrUser = async (req, res, next) => {

    const {user} = req

    const review = await Review.findByPk(req.params.reviewId)

    if (user.dataValues.id === review.dataValues.userId) {
        next ()
    } else {
        const error = new Error('Require proper authorization')
        error.status = 403
        next(error)
    }

}

const cannotFindReview = async (req, res, next) => {

    const review = await Review.findByPk(req.params.reviewId)

    if (review) next()
    else {
        const error = new Error("Review couldn't be found")
        error.status = 404
        next(error)
    }

}

const cannotFindReviewImage = async (req, res, next) => {

    const reviewImage = await ReviewImage.findByPk(req.params.imageId)

    if(reviewImage) next ()
    else {
        const error = new Error("Review Image couldn't be found")
        error.status = 404
        next(error)
    }

}

const authRevBelongToUserFromRevImg = async (req, res, next) => {

    const { user } = req

    const reviewImage = await ReviewImage.findByPk(req.params.imageId)
    
    const review = await Review.findByPk(reviewImage.dataValues.reviewId)


    if (user.dataValues.id === review.dataValues.userId) {
        next()
    } else {
        const error = new Error("Require proper authorization")
        error.status = 403
        next(error)
    }
}

const cannotFindSpotImage = async (req, res, next) => {

    const spotImage = await SpotImage.findByPk(req.params.imageId)
    
    if(spotImage) next ()
    else {
        const error = new Error("Spot Image couldn't be found")
        error.status = 404
        next(error)
    }


}

const authSpotBelongToUserFromSpotImg = async (req, res, next) => {

    const { user } = req

    const spotImage = await SpotImage.findByPk(req.params.imageId)

    const spot = await Spot.findByPk(spotImage.dataValues.spotId)

    if (user.dataValues.id === spot.dataValues.ownerId){
        next ()
    } else {
        const error = new Error('Require proper authorization')
        error.status = 403
        next (error)
    }
}


//date format received "2024-04-05T17:13:32.547Z"
//date format to return "2021-11-19 20:39:36"
const convertDate = (date) => {
    const formattingDate = [date.toSubstring(0,10), date.toSubstring(12,19)]
    
    const formattedDate = formattingDate.join(" ")

    return formattedDate
}



module.exports = {getAvgReview, checkBookings, validateBookingDates, authSpotMustBelongToCurrentUser, authBookingMustBelongToCurrentUser, authSpotCannotBelongToCurrentUser, authBookingOrSpotBelongsToCurrUser, findBookingWithId, checkIfSpotExists, authReviewMustBelongToCurrUser, cannotFindReview, authRevBelongToUserFromRevImg, cannotFindReviewImage, cannotFindSpotImage, authSpotBelongToUserFromSpotImg, convertDate};