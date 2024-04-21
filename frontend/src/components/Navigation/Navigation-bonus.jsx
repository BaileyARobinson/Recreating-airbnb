import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { SlAnchor } from "react-icons/sl"
import { Link } from 'react-router-dom'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <Link to='/'> 
        <SlAnchor />
        </Link>
      <div>
       {isLoaded && (
         <div>
           <ProfileButton user={sessionUser} />
           </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
