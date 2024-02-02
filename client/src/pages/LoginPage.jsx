import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLogin } from '../redux/state';
import { useDispatch } from 'react-redux';

import '../styles/login.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loggedin = await response.json();
      console.log(loggedin);
      if (loggedin) {
        dispatch(setLogin({ user: loggedin.user, token: loggedin.token }));
        navigate('/');
      }
    } catch (err) {
      console.log('Login failed', err.message);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an Account? <Link to="register">Sign In Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
