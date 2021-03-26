import React, {Component} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Carograph from './pages/Carograph'
import StudentProfile from './pages/StudentProfile'
import PedagogueProfile from './pages/PedagogueProfile'
import NewYearSchool from './pages/NewYearSchool'
import NewYear from './pages/NewYear'
import NewYearWorksheet from './pages/NewYearWorksheet'
import NewYearCourseWorksheet from './pages/NewYearCourseWorksheet'

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
                    <Route path='/newYearSchool' component={NewYearSchool} />     
                    <Route path='/newYear' component={NewYear} /> 
                    <Route path='/newYearWorksheet/:id' component={NewYearWorksheet} /> 
                    <Route path='/NewYearCourseWorksheet/:id' component={NewYearCourseWorksheet} /> 
                </Switch>
            </BrowserRouter>
        )

    }
}
