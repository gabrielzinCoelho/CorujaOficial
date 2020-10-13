import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './index.css'
import api from '../../services/api'
import Alert from '../../pages/components/Alert'

export default class ForgotPassword extends Component {

    state = {

        password: "",
        confirmPassword : "",

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        },
        redirect: false,
        successReset: false

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
                <div>
                    <div class="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />
                        <div class="content">
                            <form onSubmit={this.handleSubmit}>
                                <label htmlFor="senha">SENHA *</label>
                                <input 
                                    id="senha" 
                                    type="password" 
                                    placeholder="Sua senha" 
                                    required
                                    value={this.state.password}
                                    onChange={(e) => {this.handleUpdateForm({password: e.target.value})}} 
                                />
                                <label htmlFor="senha">CONFIRMAR SENHA *</label>
                                <input 
                                    id="senha" 
                                    type="password" 
                                    placeholder="Confirme sua senha" 
                                    required
                                    value={this.state.confirmPassword}
                                    onChange={(e) => {this.handleUpdateForm({confirmPassword: e.target.value})}} 
                                />
                                <button class="btn" type="submit">Enviar</button>
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