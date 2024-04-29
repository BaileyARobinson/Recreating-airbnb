import { FaRegStar } from "react-icons/fa";
import { useState } from 'react'
import { MdOutlineStar } from "react-icons/md";
import './StarReview.css'

const StarRating = ({setterStars, filledStars}) => {

    const [activeRating, setActiveRating] = useState(0)
    

    return (
        <div className='five-stars'>
            <div onMouseEnter={() => setActiveRating(1)} onMouseLeave={() => setActiveRating(0)} onClick={() => setterStars(1)}>{ activeRating > 0 || filledStars > 0 ? <MdOutlineStar /> :<FaRegStar />}</div>
            <div onMouseEnter={() => setActiveRating(2)} onMouseLeave={() => setActiveRating(0)} onClick={() => setterStars(2)} >{ activeRating > 1 || filledStars > 1 ? <MdOutlineStar /> :<FaRegStar />}</div>
            <div onMouseEnter={() => setActiveRating(3)} onMouseLeave={() => setActiveRating(0)} onClick={() => setterStars(3)} >{ activeRating > 2 || filledStars > 2 ? <MdOutlineStar /> :<FaRegStar />}</div>
            <div onMouseEnter={() => setActiveRating(4)} onMouseLeave={() => setActiveRating(0)} onClick={() => setterStars(4)}>{ activeRating > 3 || filledStars > 3 ? <MdOutlineStar /> :<FaRegStar />}</div>
            <div onMouseEnter={() => setActiveRating(5)} onMouseLeave={() => setActiveRating(0)} onClick={() => setterStars(5)}>{ activeRating > 4 || filledStars > 4 ? <MdOutlineStar /> : <FaRegStar />} </div>
        &nbsp;&nbsp; Stars</div>
    )


}

export default StarRating;