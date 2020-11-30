import React, { Component } from 'react'
import {Redirect, Link} from 'react-router-dom'

import api from '../../services/api'
import './style.css'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'

export default class Login extends Component {

    state = {

        cpf: "",
        password: "",

        CPFColor: "#777",
        CPFBorder: { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
        passwordColor: "#777",
        passwordBorder: { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },

        redirect: false,

        alertSettings: {
            open: false,
            alertTitle: "",
            alertMessage: "",
            alertSeverity: "success"
        }

    }

    handleColorInputs = (id, action) => {
        if (id === 1)
            this.setState({
                CPFColor: action === "focus" ? "#3f65e2" : "#777",
                CPFBorder: action === "focus" ?
                    { borderBottom: "1px solid #3f65e2", boxShadow: "0px 1px 0px 0px #3f65e2" } :
                    { borderBottom: "0.1px solid #777", boxShadow: "0 0.1px 0 0 #777" },
            })
        else 
            this.setState({
                passwordColor: action === "focus" ? "#3f65e2" : "#777",
                passwordBorder: action === "focus" ?
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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"></link>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
                <div className="login">
                    <div className="container">
                        <img src={require('../../assets/logo.png')} alt="Coruja" />

                        <div className="content">
                            <form onSubmit={this.handleSubmit}>
                                <div class="col s12">
                                    <label>CPF *</label>
                                </div>
                                <div class="input-field col s12">
                                    <i class="material-icons prefix" style={{color: this.state.CPFColor}}>perm_identity</i>
                                    <input
                                        id="cpf" 
                                        type="text" 
                                        placeholder="Seu CPF"
                                        required
                                        value={this.state.cpf}
                                        style={{
                                            color: this.state.CPFColor,
                                            ...this.state.CPFBorder,
                                        }}
                                        onFocus={() => { this.handleColorInputs(1, "focus") }}
                                        onBlur={() => { this.handleColorInputs(1, "blur") }}
                                        onChange={(e) => { this.handleUpdateForm({cpf: e.target.value}) }}
                                    />
                                </div>
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
                                        onFocus={() => { this.handleColorInputs(2, "focus") }}
                                        onBlur={() => { this.handleColorInputs(2, "blur") }}
                                        onChange={(e) => { this.handleUpdateForm({password: e.target.value}) }}  
                                    />
                                </div>
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