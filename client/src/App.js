import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import FormPage from './components/form';
import Details from './components/details';
import PaymentForm from './components/payment';
import confirmation from './components/confirmation';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
        <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/products' component={Products} />
          <Route path='/sign-up' component={SignUp} />
          <Route path='/form' component={FormPage} />
          <Route path="/details" component={Details} />
          <Route path="/payment" component={PaymentForm} />
          <Route path="/confirmation" component={confirmation} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
