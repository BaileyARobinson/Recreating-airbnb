import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { SlAnchor } from "react-icons/sl"
import { Link } from 'react-router-dom'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navbar'>
      <Link to='/'> 
        <SlAnchor /> 
        </Link>
      <div>
       {isLoaded && (
         <div className='right-side-nav'>
         {sessionUser && <Link className='create-a-spot-link' to='/spots/new'>Create a Spot</Link>
          }
           <ProfileButton className='profile-button'user={sessionUser} />
           </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
