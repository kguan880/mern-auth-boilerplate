import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Home from "./components/pages/Home"
import Login from './auth/Login'
import Register from './auth/Register'
 
export default function App() {
    return <>
    <BrowserRouter>
    <Switch>
       <Route exact path="/" component={Home}/>
       <Route path="/login" component={Login}/>
       <Route path="/register" component={Register}/>

    </Switch>
    </BrowserRouter>
    </>
}
