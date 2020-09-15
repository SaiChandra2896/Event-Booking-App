import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';

import AuthContext from '../../context/authContext';

import './Navigation.css';

const Navigation = (props) => {
    const authContext = useContext(AuthContext);
    return (
        <header className="main-navigation">
           <div className="main-navigation__logo">
               <h1>EasyEvent</h1>
           </div>
           <nav className="main-navigation__items">
                <ul>
                    {!authContext.token && (
                        <li>
                            <NavLink to="/auth">
                                Authentication
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to="/events">
                            Events
                        </NavLink>
                    </li>
                    {authContext.token && (
                    <li>
                        <NavLink to="/bookings">
                            Bookings
                        </NavLink>
                    </li>
                    )}
                </ul>
           </nav>
        </header>
    )
}

export default Navigation;
