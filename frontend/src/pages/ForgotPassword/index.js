import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './index.css'
import api from '../../services/api'
import Alert from '../../pages/components/Alert'

export default class ForgotPassword extends Component {

    state = {
        email: "",

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        }

    }

    handleUpdateEmail = (e) => {

        this.setState({
            email: e.target.value
        })

    }

    handleForgotPassword = async (e) => {

        e.preventDefault()

        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if(!regex.test(this.state.email)){

            this.setState({
    
                alertSettings: {
                    open: true,
                    alertTitle: "Email Inválido",
                   alertMessage: `Tente novamente com um email válido.`,
                   alertSeverity: "warning"
                }
            })

            return false

        }

        try{

            await api.post('/pedagogue/forgotPassword', {
                email: this.state.email,
                redirect: "http://127.0.0.1:3000/resetPassword"
            })

        }catch(error) {

            this.setState({
    
                alertSettings: {
                    open: true,
                    alertTitle: "Envio de email falhou",
                   alertMessage: `Não foi possível realizar este processo, tente novamente.`,
                   alertSeverity: "error"
                }
            })

            return false

        }

        this.setState({
    
            alertSettings: {
                open: true,
                alertTitle: "Redefinação de Senha",
               alertMessage: `Um email para redefinação de senha foi enviado para ${this.state.email}.`,
               alertSeverity: "info"
            }
        })
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
                <div>
                    <div class="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />
                        <div class="content">
                            <form onSubmit={this.handleForgotPassword}>
                                <label htmlFor="email">EMAIL *</label>
                                <input 
                                    id="email" 
                                    type="text" 
                                    placeholder="Informe seu email" 
                                    required
                                    value={this.state.email}
                                    onChange={this.handleUpdateEmail}
                                />
                                <button class="btn" type="submit">Enviar</button>
                            </form>
                            <Link to="/"><p><b>Voltar para Login</b></p><br/></Link>
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
            </>
        )

    }


}