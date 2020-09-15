import React,{Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';

import AuthContext from './context/authContext';

import AuthPage from './pages/Auth/AuthPage';
import BookingsPage from  './pages/BookingsPage';
import EventsPage from './pages/EventsPage';

import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token,userId, tokenExpiration) =>{
    setToken(token);
    setUserId(userId);
  }

  const logout = () =>{
    setToken(null);
    setUserId(null);
  }

  return (
    <Router>
      <Fragment>
        <AuthContext.Provider value={{
          token, 
          userId,
          login,
          logout
        }}>
          <Navigation/>
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact/>
              <Route path="/auth" component={AuthPage}/>
              <Route path="/events" component={EventsPage}/>
              <Route path="/bookings" component={BookingsPage}/>
            </Switch>
          </main>
        </AuthContext.Provider>
      </Fragment>
    </Router>
  );
}

export default App;
