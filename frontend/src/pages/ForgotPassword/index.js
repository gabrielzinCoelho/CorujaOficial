import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Image, Form, Button } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import './style.css'

export default class ForgotPassword extends Component {
  state = {
    email: "",
    password: "",
    viewPassword: false,
    redirect: false,
    validateEmail: null,

    alertSettings: {
      open: false,
      alertTitle: "",
      alertMessage: "",
      alertSeverity: "success"
    }
  }

  handleCloseAlert = () => {
    this.setState(prevState => ({
      alertSettings: {
        ...prevState.alertSettings,
        ...{ open: false }
      }
    }))
  }

  handleUpdateForm = (forceData) => {
    this.setState(prevState => ({
      ...prevState,
      ...forceData
    }))
  }

  validator = (value) => {
    const validEmailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (value === '' || value === undefined) return null;
    return validEmailRegex.test(value)
  };

  handleSubmit = async (e) => {
    e.preventDefault()

    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  
    if (!regex.test(this.state.email)) {
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

    try {
      await api.post('/pedagogue/forgotPassword', {
        email: this.state.email,
        redirect: "http://127.0.0.1:3000/resetPassword"
      })
    } catch (error) {
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

  render() {
    return (
      <>
        <div className="forgotPassword">
          <Container>
            <Image src={require('../../assets/logo.png')} />
            <div className="content">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    className={this.state.validateEmail === null ? "form-control" : (this.state.validateEmail ? "form-control is-valid" : "form-control is-invalid")}
                    required
                    type="email"
                    placeholder="Seu email"
                    value={this.state.email}
                    onChange={(e) => {
                      this.handleUpdateForm({ email: e.target.value })
                      this.setState({ validateEmail: this.validator(e.target.value) })
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Escreva um email válido!
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button disabled={!this.state.validateEmail} variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
              <Link variant="primary" to="/"><p>Voltar para Login</p></Link>
            </div>
          </Container>
        </div>

        <Alert
          alertSeverity={this.state.alertSettings.alertSeverity}
          alertTitle={this.state.alertSettings.alertTitle}
          alertMessage={this.state.alertSettings.alertMessage}
          open={this.state.alertSettings.open}
          handleClose={this.handleCloseAlert}
        />
      </>
    )
  }
}
