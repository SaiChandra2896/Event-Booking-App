import React,{useState} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import BookingsPage from  './pages/BookingsPage';
import EventsPage from './pages/EventsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
      <Redirect from="/" to="/auth" exact/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/events" component={EventsPage}/>
      <Route path="/bookings" component={BookingsPage}/>
      </Switch>
    </Router>
  );
}

export default App;
