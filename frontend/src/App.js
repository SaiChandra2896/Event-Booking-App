import React,{Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';

import AuthContext from './context/authContext';

import AuthPage from './pages/Auth/AuthPage';
import BookingsPage from  './pages/BookingsPage';
import EventsPage from './pages/Events/EventsPage';

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
              {!token && (<Redirect from="/" to="/auth" exact/>)}
              {!token && (<Redirect from="/bookings" to="/auth" exact/>)}
              {token && (<Redirect from="/" to="/events" exact/>)}
              {token && (<Redirect from="/auth" to="/events" exact/>)}

              {!token && (<Route path="/auth" component={AuthPage}/>)}
              <Route path="/events" component={EventsPage}/>
              {token && (<Route path="/bookings" component={BookingsPage}/>)}
            </Switch>
          </main>
        </AuthContext.Provider>
      </Fragment>
    </Router>
  );
}

export default App;
