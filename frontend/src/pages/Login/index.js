import React, { Component } from 'react'
import {Redirect, Link} from 'react-router-dom'

import api from '../../services/api'
import './index.css'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'

export default class Login extends Component {

    state = {

        cpf: "",
        password: "",

        redirect: false,

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        }

    }

    handleUpdateForm = (forceData) => {
        this.setState(prevState => ({
            ...prevState,
            ...forceData
        }))
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        let token = ""

        try{

            const {data} = await api.post('/pedagogue/login', {
                cpf: this.state.cpf,
                password: this.state.password
            })

            token = data.token

        }catch(err){

            this.setState({

                alertSettings: {
                    open: true,
                    alertTitle: "Erro",
                   alertMessage: "Falha no Login",
                   alertSeverity: "error"
                },
                password: ""
            })

            return null;

        }

        sessionStorage.setItem('token', token);
        this.setState({ redirect: true })

    }

    handleCloseAlert = () => {
        this.setState(prevState => ({
            alertSettings: {
                ...prevState.alertSettings,
                ...{ open: false}
            }
        }))
    }

    render() {

        return (
            <>
                <Authentication redirectWhenLogged={true} redirectUrl="/carograph" />
                <div>
                    <div className="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />

                        <div className="content">
                            <form onSubmit={this.handleSubmit}>
                                <label htmlFor="cpf">CPF *</label>
                                <input 
                                    id="cpf" 
                                    type="text" 
                                    placeholder="Seu CPF" 
                                    required
                                    value={this.state.cpf}
                                    onChange={(e) => {
                                        this.handleUpdateForm({cpf: e.target.value})
                                    }} 
                                />
                                <label htmlFor="senha">SENHA *</label>
                                <input 
                                    id="senha" 
                                    type="password" 
                                    placeholder="Sua senha" 
                                    required
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.handleUpdateForm({password: e.target.value})
                                    }}  
                                />
                                <button className="btn">Entrar</button>
                            </form>
                           <Link to="/forgotPassword"><p><b>Esqueci minha senha</b></p><br/></Link>
                        </div>
                    </div>
                </div>
                <Alert 
                    alertSeverity = {this.state.alertSettings.alertSeverity}
                    alertTitle = {this.state.alertSettings.alertTitle}
                    alertMessage = {this.state.alertSettings.alertMessage}
                    open = {this.state.alertSettings.open}
                    handleClose = {this.handleCloseAlert}
                />
                {
                    (()=> {
                        return (this.state.redirect) ? 
                            <Redirect push to='/carograph'/>
                            :
                            null
                    })()
                }
            </>
        )


    }


}