import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Header from "./components/layouts/Header"
import Home from "./components/pages/Home"
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.scss'


 
export default function App() {
    return <>
    <BrowserRouter>
    <Header />
    <Switch>
       <Route exact path="/" component={Home}/>
       <Route path="/login" component={Login}/>
       <Route path="/register" component={Register}/>
    </Switch>
    </BrowserRouter>
    </>
}
