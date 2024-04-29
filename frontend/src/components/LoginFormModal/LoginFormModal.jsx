import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom'


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }).then(()=> navigate('/'))
  };

  const handleDemoUser = (e) => {
    e.preventDefault()
    return dispatch(sessionActions.login({credential: "it-me", password: 'password'}))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  }

  return (
    <div className='login-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
       <div className='form'>  <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className='errors'>{errors.credential}</p>}
        <button className= 'login-button' type="submit" disabled={password.length < 6 || credential.length < 4}>Log In</button>
        </div>
      </form>
      <div className='form'>
        
        <Link className='demo-user'to={'/'} onClick={handleDemoUser}>Demo User</Link>
      </div>
      
    </div>
  );
}

export default LoginFormModal;
