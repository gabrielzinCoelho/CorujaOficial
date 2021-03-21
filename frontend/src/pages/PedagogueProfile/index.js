import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Image, Navbar, Dropdown, DropdownButton, Form, Col, Button } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class PedagogueProfile extends Component {
  state = {
    pedagogue: null,
    pedagogueInitialValues: null,
    viewMode: true,
    menuOpen: true,

    alertSettings: {
      open: false,
      alertTitle: "",
      alertMessage: "",
      alertSeverity: "success"
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    const token = sessionStorage.getItem('token');

    const pedagogue = await api.get(`/pedagogue/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    for (let prop in pedagogue.data) {
      if (pedagogue.data[prop] == null)
        pedagogue.data[prop] = ""
    }

    this.setState({
      pedagogue: pedagogue.data,
      pedagogueInitialValues: pedagogue.data
    })
    console.log(this.state.pedagogue)
  }

  goToEditMode = () => {
    this.setState({
      viewMode: false
    })
  }

  updatePedagogue = (forceData) => {
    this.setState((prevState) => ({
      pedagogue: { ...prevState.pedagogue, ...forceData }
    }))
  }

  cancelEdit = () => {
    this.setState(prevState => ({
      viewMode: true,
      pedagogue: prevState.pedagogueInitialValues
    }))
  }

  handleUpdate = async () => {
    const updateObject = {}
    const notValidateFields = ["id", "path"]
    const token = sessionStorage.getItem('token');
    let alertSettings = {}

    for (let prop in this.state.pedagogue) {
      if (!notValidateFields.includes(prop))
        updateObject[prop] = this.state.pedagogue[prop]
    }

    console.log(updateObject)
    const data = await api.put(`/pedagogue/${this.state.pedagogue.id}`, updateObject, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    alertSettings = (200 <= data.status && data.status <= 299) ?
      ({
        open: true,
        alertTitle: "Sucesso",
        alertMessage: "Dados do pedagogo foram atualizados com sucesso.",
        alertSeverity: "success"
      }) : ({
        open: true,
        alertTitle: "Erro",
        alertMessage: "Erro ao atualizar dados do pedagogo.",
        alertSeverity: "error"
      })

    this.setState(prevState => ({
      viewMode: true,
      pedagogueInitialValues: prevState.pedagogue,
      alertSettings
    }))
  }

  handleCloseAlert = () => {
    this.setState(prevState => ({
      alertSettings: {
        ...prevState.alertSettings,
        ...{ open: false }
      }
    }))
  }

  render() {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <Authentication redirectWhenLogged={false} redirectUrl="/" />

        <div className="profile-page">
          <div className="side-menu"
            style={{
              marginLeft: this.state.pedagogue ? (this.state.menuOpen ? "0" : "-25vw") : "-25w"
            }}>
            {this.state.pedagogue ? (
              <>
                <div className="profile">
                  <div className="profile-img">
                    <Image src={require(`../../../../backend/app/uploads/${this.state.pedagogue.path}`)} />
                  </div>
                  <h2 className="profile-name">{this.state.pedagogue.name}</h2>
                  <h2 className="profile-text" style={{ margin: "5% 0 0 0" }}>{this.state.pedagogue.cpf}</h2>
                  <h2 className="profile-text">{this.state.pedagogue.email}</h2>
                </div>

                <div className="options-menu">
                  <hr className="divider rounded" />
                  <a href="/carograph">
                    <div className="options-btn">
                      <span className="options-btn-label">Visualizar Carógrafo</span>
                    </div>
                  </a>
                  <a href="/" onClick={() => sessionStorage.clear()}>
                    <div className="options-btn-quit">
                      <span className="options-btn-quit-label">Sair</span>
                    </div>
                  </a>
                </div>
                <span className="campus-name"><a href="#">Campus Divinópolis</a></span>
              </>
            ) : (
              <>
                <Image className="without-content" src={require('../../assets/logo.png')} />
              </>
            )}
          </div>

          <div className="page-content">
            <Navbar className="top-bar">
              <Button variant="light" className="menu-button"
                onClick={(e) => {
                  this.setState({
                    menuOpen: !this.state.menuOpen,
                  })
                }}
              >
                <i class="fa fa-bars"></i>
              </Button>

              <div className="top-image">
                <Image className="logo-image" src={require('../../assets/logo.png')} />
              </div>

              <DropdownButton
                drop="left"
                title={<Image className="pedagogue-img" src={(path => {
                  path = path ? path : "default.jpg"

                  return require(`../../../../backend/app/uploads/${path}`)
                })(sessionStorage.getItem('path'))} alt="" />}
              >
                <Dropdown.Item>Virada de Ano</Dropdown.Item>
                <Dropdown.Item>Virada de Ano Escolar</Dropdown.Item>
                <Dropdown.Item>Gerenciar Pedagogos</Dropdown.Item>
                <Dropdown.Item href="/carograph">Ver Carógrafo</Dropdown.Item>
                <Dropdown.Item id="quit" href="/" onClick={() => sessionStorage.clear()}>Sair</Dropdown.Item>
              </DropdownButton>
            </Navbar>

            <div className="pedagogue-profile">
              <h3 className="group-title">Informações Pessoais</h3>
              <div className="group-infos">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Nome"
                        value={(this.state.pedagogue) ? this.state.pedagogue.name : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ name: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="email"
                        placeholder="Email"
                        value={(this.state.pedagogue) ? this.state.pedagogue.email : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ email: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>CPF</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="CPF"
                        value={(this.state.pedagogue) ? this.state.pedagogue.cpf : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ cpf: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Contato</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Contato"
                        value={(this.state.pedagogue) ? this.state.pedagogue.contact : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ contact: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Idade</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Idade"
                        value={(this.state.pedagogue) ? this.state.pedagogue.age : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ age: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>

              <h3 className="group-title">Endereço</h3>
              <div className="group-infos">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Cidade"
                        value={(this.state.pedagogue) ? this.state.pedagogue.city : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ city: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Bairro</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Bairro"
                        value={(this.state.pedagogue) ? this.state.pedagogue.district : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ district: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Endereço</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Endereço"
                        value={(this.state.pedagogue) ? this.state.pedagogue.address : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ address: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Número"
                        value={(this.state.pedagogue) ? this.state.pedagogue.address_number : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ address_number: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Complemento"
                        value={(this.state.pedagogue) ? this.state.pedagogue.address_complement : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updatePedagogue({ address_complement: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>

              {
                (this.state.viewMode) ?
                  (<Button className="profile-btn" onClick={this.goToEditMode}>Editar</Button>)
                  :
                  (<>
                    <Button className="profile-btn" style={{ marginRight: '16px' }} onClick={this.cancelEdit}>Cancelar</Button>
                    <Button className="profile-btn" onClick={this.handleUpdate}>Salvar</Button>
                  </>)
              }
            </div>
          </div>
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