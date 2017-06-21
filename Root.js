// REACT-ROUTER
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import React from 'react'
import createHistory from 'history/createBrowserHistory'

import App from './App';

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
  return (
    <h1>Home Page</h1>
  )
}
function About() {
  return (
    <h1>About Page</h1>
  )
}

function ReactRouter() {
  return (
    <BrowserRouter history={history}>
      <App>
        <Navigation />
        <Switch>  
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </Switch>
      </App>
    </BrowserRouter>
  )
}

export default ReactRouter
