import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Image, Form, Button } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import './style.css'

export default class ResetPassword extends Component {
  state = {
    password: "",
    confirmPassword: "",
    viewPasswords: false,
    redirect: false,
    successReset: false,
    validatePassword: null,
    validateConfirmPassword: null,

    alertSettings: {
      open: false,
      alertTitle: "",
      alertMessage: "",
      alertSeverity: "success"
    }
  }

  handleCloseAlert = () => {
    const redirect = (this.state.successReset) ? true : false

    this.setState(prevState => ({
      alertSettings: {
        ...prevState.alertSettings,
        ...{ open: false }
      },
      redirect,
    }))
  }

  handleUpdateForm = (forceData) => {
    this.setState(prevState => ({
      ...prevState,
      ...forceData
    }))
  }

  validator = (value) => {
    const validPasswordRegex = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/);

    if (value === '' || value === undefined) return null;
    return validPasswordRegex.test(value)
  };

  handleSubmit = async (e) => {
    e.preventDefault()
  
    if (this.state.password != this.state.confirmPassword) {
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
    } catch (error) {
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

  render() {
    return (
      <>
        <div className="resetPassword">
          <Container>
            <Image src={require('../../assets/logo.png')} />
            <div className="content">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Senha *</Form.Label>
                  <Form.Control
                    className={this.state.validatePassword === null ? "form-control" : (this.state.validatePassword ? "form-control is-valid" : "form-control is-invalid")}
                    required
                    type={this.state.viewPasswords ? "text" : "password"}
                    placeholder="Nova senha"
                    value={this.state.password}
                    onChange={(e) => {
                      this.handleUpdateForm({ password: e.target.value })
                      this.setState({ validatePassword: this.validator(e.target.value) })
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Escreva uma senha válida!
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirmação da senha *</Form.Label>
                  <Form.Control
                    className={this.state.validateConfirmPassword === null ? "form-control" : (this.state.validateConfirmPassword ? "form-control is-valid" : "form-control is-invalid")}
                    required
                    type={this.state.viewPasswords ? "text" : "password"}
                    placeholder="Confirme a senha"
                    value={this.state.confirmPassword}
                    onChange={(e) => {
                      this.handleUpdateForm({ confirmPassword: e.target.value })
                      this.setState({ validateConfirmPassword: this.validator(e.target.value) })
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Escreva uma senha válida!
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formViewConfirmPassword">
                  <Form.Check
                    type="switch"
                    label="Veja as senhas"
                    onChange={(e) => { this.handleUpdateForm({ viewPasswords: !this.state.viewPasswords }) }}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Editar senha
                </Button>
              </Form>
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

        { (()=> { return (this.state.redirect) ? <Redirect push to='/'/> : null })() }
      </>
    )
  }
}
