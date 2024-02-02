import { IconButton } from '@mui/material';
import { Search, Person, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

import variables from '../styles/Variables.scss';
import '../styles/navbar.scss';
import { setLogout } from '../redux/state';

const Navbar = () => {
  const listing = '/create-listings';
  const loginListing = '/login';

  const dispatch = useDispatch();

  const [dropDownMenu, setDropDownMenu] = useState(false);

  const user = useSelector((state) => state.user);
  console.log(user);
  return (
    <div className="navbar">
      <Link to="/">
        <img src="/assets/logo.png" alt="Logo-Img" />
      </Link>
      <div className="navbar_search">
        <input type="text" placeholder="Search..." />
        <IconButton>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>
      <div className="navbar_right">
        <Link to={user ? listing : loginListing} className="host">
          Become a host
        </Link>
        <button
          className="navbar_right_account"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={`http://localhost:8000/${user.profileImagePath.replace(
                'public',
                ''
              )}`}
              alt="Profile"
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          )}
        </button>
        {dropDownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Login</Link>
            <Link to="/register">Sign up</Link>
          </div>
        )}

        {dropDownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to="">Trip List</Link>
            <Link to="">Wish List</Link>
            <Link to="">Property List</Link>
            <Link to="">Reservation List</Link>
            <Link to="">Become A Host</Link>
            <Link to="/login" onClick={() => dispatch(setLogout())}>
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
