import React,{Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';

import AuthPage from './pages/Auth/AuthPage';
import BookingsPage from  './pages/BookingsPage';
import EventsPage from './pages/EventsPage';

import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navigation/>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={AuthPage}/>
            <Route path="/events" component={EventsPage}/>
            <Route path="/bookings" component={BookingsPage}/>
          </Switch>
        </main>
      </Fragment>
    </Router>
  );
}

export default App;
