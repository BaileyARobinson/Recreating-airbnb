import { useState, useEffect, useRef } from 'react';
import { useDispatch, } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useNavigate } from 'react-router-dom'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    navigate('/')
    closeMenu()
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        <p>{user.username}</p>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
        <p>
          <button onClick={logout}>Log Out</button>
        </p>
      </div>
    </>
  );
}

export default ProfileButton;

