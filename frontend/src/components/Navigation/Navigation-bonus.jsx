import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { SlAnchor } from "react-icons/sl"
import { Link } from 'react-router-dom'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <nav className='navbar'>
      <div className='left-side-nav'><Link to='/'> 
        <SlAnchor /> 
        </Link>
        <a href='/'><img src='../../public/BoatBnb.png'/></a>
        </div>
      <div>
       {isLoaded && (
         <div className='right-side-nav'>
         {sessionUser && <Link className='create-a-spot-link' to='/spots/new'>Create a New Spot</Link>
          }
           <ProfileButton className='profile-button'user={sessionUser} />
           </div>
        )}
      </div>
      
    </nav>
    </>
  );
}

export default Navigation;
