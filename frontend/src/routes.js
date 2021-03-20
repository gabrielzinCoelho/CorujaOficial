import React, {Component} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Carograph from './pages/Carograph'
import StudentProfile from './pages/StudentProfile'
import PedagogueProfile from './pages/PedagogueProfile'

export default class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/' exact component={Login} />
                    <Route path='/forgotPassword' component={ForgotPassword} />
                    <Route path='/resetPassword/:token' component={ResetPassword} />
                    <Route path='/carograph' component={Carograph} />  
                    <Route path='/studentProfile/:id' component={StudentProfile} />   
                    <Route path='/pedagogueProfile/:id' component={PedagogueProfile} />   
                </Switch>
            </BrowserRouter>
        )

    }
}
