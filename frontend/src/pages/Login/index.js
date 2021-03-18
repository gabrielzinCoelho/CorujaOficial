import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Container, Image, Form, Button } from 'react-bootstrap'
import InputMask from 'react-input-mask'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class Login extends Component {
  state = {
    cpf: "",
    password: "",
    viewPassword: false,
    redirect: false,
    validateCpf: null,
    validatePassword: null,

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

  validator = (value, input) => {
    if (value === '' || value === undefined) return null;

    if (input === "cpf") {
      const cpf = value.replace(/[^\d]+/g, '');
      if (cpf === '') return false;
      // Elimina CPFs invalidos conhecidos	
      if (cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999")
        return false;
      // Valida 1o digito	
      let add = 0;
      for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
      let rev = 11 - (add % 11);
      if (rev === 10 || rev === 11)
        rev = 0;
      if (rev !== parseInt(cpf.charAt(9)))
        return false;
      // Valida 2o digito	
      add = 0;
      for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11)
        rev = 0;
      if (rev !== parseInt(cpf.charAt(10)))
        return false;
      return true;
    }
    else if (input === "password") {
      const validPasswordRegex = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/);
      return validPasswordRegex.test(value)
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault()


    const cpf = this.state.cpf.replace(/[^\d]+/g, '')
    try {
      const { data } = await api.post('/pedagogue/login', { cpf: cpf, password: this.state.password })

      for (const item in data)
        sessionStorage.setItem(item, data[item]);

      this.setState({ redirect: true })

    } catch (err) {
      this.setState({
        alertSettings: {
          open: true,
          alertTitle: "Erro",
          alertMessage: "Falha no Login.",
          alertSeverity: "error"
        },
        password: ""
      })

      return null;
    }

  }

  render() {
    return (
      <>
        <Authentication redirectWhenLogged={true} redirectUrl="/carograph" />
        <div className="login">
          <Container>
            <Image src={require('../../assets/logo.png')} />
            <div className="content">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group required controlId="formCpf">
                  <Form.Label>CPF *</Form.Label>
                  <InputMask
                    className={this.state.validateCpf === null ? "form-control" : (this.state.validateCpf ? "form-control is-valid" : "form-control is-invalid")}
                    mask='999.999.999-99'
                    maskChar={null}
                    placeholder='Seu CPF'
                    value={this.state.cpf}
                    onChange={(e) => {
                      this.handleUpdateForm({ cpf: e.target.value })
                      this.setState({ validateCpf: this.validator(e.target.value, "cpf") })
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Escreva um CPF válido!
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">
                    Seus dados estão seguros conosco.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Senha *</Form.Label>
                  <Form.Control
                    className={this.state.validatePassword === null ? "form-control" : (this.state.validatePassword ? "form-control is-valid" : "form-control is-invalid")}
                    required
                    type={this.state.viewPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={this.state.password}
                    onChange={(e) => {
                      this.handleUpdateForm({ password: e.target.value })
                      this.setState({ validatePassword: this.validator(e.target.value, "password") })
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Escreva uma senha válida!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formViewPassword">
                  <Form.Check
                    type="switch"
                    label="Veja sua senha"
                    onChange={(e) => { this.handleUpdateForm({ viewPassword: !this.state.viewPassword }) }}
                  />
                </Form.Group>

                <Button disabled={!this.state.validateCpf || !this.state.validatePassword} variant="primary" type="submit">
                  Fazer login
                </Button>
              </Form>
              <Link variant="primary" to="/forgotPassword"><p>Esqueci minha senha</p></Link>
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

        {(() => { return (this.state.redirect) ? <Redirect push to='/carograph' /> : null })()}
      </>
    )
  }
}
