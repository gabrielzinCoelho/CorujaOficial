import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.css'
import api from '../../services/api'
import Alert from '../../pages/components/Alert'

export default class ForgotPassword extends Component {

    state = {
        email: "",

        emailColor: "#777",
        emailBorder: { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        }

    }

    handleColorInput = (action) => {
        this.setState({
            emailColor: action === "focus" ? "#3f65e2" : "#777",
            emailBorder: action === "focus" ?
                { borderBottom: "1px solid #3f65e2", boxShadow: "0px 1px 0px 0px #3f65e2" } :
                { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
        })
    }

    handleUpdateEmail = (e) => {

        this.setState({
            email: e.target.value
        })

    }

    handleSubmit = async (e) => {

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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"></link>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
                <div className="forgotPassword">
                    <div className="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />

                        <div className="content">
                            <form onSubmit={this.handleSubmit}>
                                <div class="col s12">
                                    <label>EMAIL *</label>
                                </div>
                                <div class="input-field col s12">
                                    <i class="material-icons-outlined prefix" style={{color: this.state.emailColor}}>mail</i>
                                    <input
                                        id="email" 
                                        type="email" 
                                        placeholder="Seu email" 
                                        required
                                        value={this.state.email}
                                        style={{
                                            color: this.state.emailColor,
                                            ...this.state.emailBorder,
                                        }}
                                        onFocus={() => { this.handleColorInput("focus") }}
                                        onBlur={() => { this.handleColorInput("blur") }}
                                        onChange={ this.handleUpdateEmail }
                                    />
                                </div>
                                <button class="btn">Enviar</button>
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