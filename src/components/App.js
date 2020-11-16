import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import PizzaForm from "./PizzaForm";
import Bar from "./Bar";
import { Provider } from 'react-redux'
import store from '../store/index'
import AdminPanel from "./AdminPanel";


class App extends Component {

  async componentDidMount() {
  }

  render() {
    return (
        <Provider store={store}>
            <Router>
                <Bar/>
                <div className='container'>
                  <Switch>
                      <Route path="/admin">
                          <AdminPanel />
                      </Route>
                      <Route path="/">
                          <PizzaForm />
                      </Route>
                  </Switch>
                </div>
            </Router>
        </Provider>
    );
  }
}

export default App;
