import './App.css';
import React from 'react';
import BookList from './BookList';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

const App = ()=>{
    return (
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/book-list">Book List</Link>
                </li>
              </ul>
            </nav>
    
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/book-list">
                <BookList />
              </Route>
            </Switch>
          </div>
        </Router>
      );    
}
export default App;
