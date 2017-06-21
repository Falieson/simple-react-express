// REACT-ROUTER
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import React from 'react'
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import App from './App';
// import CounterRedux, { PX_COUNTERS_REDUCER as PX_COUNTERS_THUNK } from './components/CounterRedux'
import CounterPostgres, { PX_COUNTERS_REDUCER as PX_COUNTERS_POSTGRES } from './components/CounterPostgres'

const history = createHistory()

function Navigation() {
  const style = {
    display: 'inline-flex',
    marginRight: '10px'
  }

  const ListLink = (route, label)=> (
    <li style={style}>
      <Link to={route}>{label}</Link>
    </li>
  )

  return (
    <ul>
      {ListLink('/', 'Home')}
      {ListLink('/about', 'About')}
    </ul>
  )
}
function Home() {
  // return (
  //   <h1>Home Page</h1>
  // )
  // return (
  //   <CounterRedux />
  // )
  return (
    <CounterPostgres />
  )
}
function About() {
  return (
    <h1>About Page</h1>
  )
}


// REDUX
const rootReducer = combineReducers({
  // PX_COUNTERS_THUNK: PX_COUNTERS_THUNK
  PX_COUNTERS_POSTGRES: PX_COUNTERS_POSTGRES
})
const middlewares = [ReduxThunk]
const preloadedState={}
const store = createStore(rootReducer, preloadedState,
  composeWithDevTools(
    applyMiddleware(...middlewares)
  )
);

function ReactRouter() {
  return (
    <Provider store={store}>
      <BrowserRouter history={history}>
        <App>
          <Navigation />
          <Switch>  
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
          </Switch>
        </App>
      </BrowserRouter>
    </Provider>
  )
}

export default ReactRouter
