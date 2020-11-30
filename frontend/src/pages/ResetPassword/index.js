import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './style.css'
import api from '../../services/api'
import Alert from '../../pages/components/Alert'

export default class ForgotPassword extends Component {

    state = {

        password: "",
        confirmPassword : "",

        passwordColor: "#777",
        passwordBorder: { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
        confirmPasswordColor: "#777",
        confirmPasswordBorder: { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        },
        redirect: false,
        successReset: false

    }

    handleColorInputs = (id, action) => {
        if (id === 1)
            this.setState({
                passwordColor: action === "focus" ? "#3f65e2" : "#777",
                passwordBorder: action === "focus" ?
                    { borderBottom: "1px solid #3f65e2", boxShadow: "0px 1px 0px 0px #3f65e2" } :
                    { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
            })
        else 
            this.setState({
                confirmPasswordColor: action === "focus" ? "#3f65e2" : "#777",
                confirmPasswordBorder: action === "focus" ?
                    { borderBottom: "1px solid #3f65e2", boxShadow: "0px 1px 0px 0px #3f65e2" } :
                    { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
            })
    }

    handleUpdateForm = (forceData) => {

        this.setState(prevState => ({
            ...prevState,
            ...forceData
        }))

    }

    handleSubmit = async (e) => {

        e.preventDefault()
       
        if(this.state.password != this.state.confirmPassword){

            this.setState({

                password: "",
                confirmPassword: "",

                alertSettings: {
                    open: true,
                    alertTitle: "Cuidado!",
                    alertMessage: "As duas senhas devem ser idênticas",
                    alertSeverity: "warning"
                },
            })

            return false

        }

        try {

            await api.put('/pedagogue/resetPassword', {
                token: this.props.match.params.token,
                password: this.state.password
            })

        }catch(error) {

            this.setState({
    
                alertSettings: {
                    open: true,
                    alertTitle: "Redefinação de senha falhou",
                    alertMessage: `Não foi possível realizar este processo, tente novamente.`,
                    alertSeverity: "error"
                }
            })

            return false

        }

        this.setState({
    
            alertSettings: {
                open: true,
                alertTitle: "Redefinação de Senha realizada com sucesso",
               alertMessage: `Sua nova senha definida está pronta para uso`,
               alertSeverity: "success"
            },
            successReset: true
        })

        

    }

    handleCloseAlert = () => {

        const redirect = (this.state.successReset) ? true : false

        this.setState(prevState => ({
            alertSettings: {
                ...prevState.alertSettings,
                ...{ open: false}
            },
            redirect,
        }))
    }

    render() {

        return (
            <>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"></link>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
                <div className="resetPassword">
                    <div className="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />

                        <div className="content">
                            <form onSubmit={this.handleSubmit}>
                                <div class="col s12">
                                    <label>SENHA *</label>
                                </div>
                                <div class="input-field col s12">
                                    <i class="material-icons-outlined prefix" style={{color: this.state.passwordColor}}>lock</i>
                                    <input
                                        id="senha" 
                                        type="password" 
                                        placeholder="Sua senha" 
                                        required
                                        value={this.state.password}
                                        style={{
                                            color: this.state.passwordColor,
                                            ...this.state.passwordBorder,
                                        }}
                                        onFocus={() => { this.handleColorInputs(1, "focus") }}
                                        onBlur={() => { this.handleColorInputs(1, "blur") }}
                                        onChange={(e) => {this.handleUpdateForm({password: e.target.value}) }}
                                    />
                                </div>
                                <div class="col s12">
                                    <label>CONFIRMAR SENHA *</label>
                                </div>
                                <div class="input-field col s12">
                                    <i class="material-icons-outlined prefix" style={{color: this.state.confirmPasswordColor}}>lock</i>
                                    <input
                                        id="senha" 
                                        type="password" 
                                        placeholder="Confirme sua senha" 
                                        required
                                        value={this.state.confirmPassword}
                                        style={{
                                            color: this.state.confirmPasswordColor,
                                            ...this.state.confirmPasswordBorder,
                                        }}
                                        onFocus={() => { this.handleColorInputs(2, "focus") }}
                                        onBlur={() => { this.handleColorInputs(2, "blur") }}
                                        onChange={(e) => {this.handleUpdateForm({confirmPassword: e.target.value}) }}
                                    />
                                </div>
                                <button class="btn">Enviar</button>
                            </form>
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
                            <Redirect push to='/'/>
                            :
                            null
                    })()
                }
            </>
        )

    }


}