import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Image, Navbar, Dropdown, DropdownButton, Form, Col, Button } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class StudentProfile extends Component {
  state = {
    student: null,
    studentInitialValues: null,
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

    const student = await api.get(`/student/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    for (let prop in student.data) {
      if (student.data[prop] == null)
        student.data[prop] = ""
    }

    this.setState({
      student: student.data,
      studentInitialValues: student.data
    })
  }

  goToEditMode = () => {
    this.setState({
      viewMode: false
    })
  }

  updateStudent = (forceData) => {
    this.setState((prevState) => ({
      student: { ...prevState.student, ...forceData }
    }))
  }

  cancelEdit = () => {
    this.setState(prevState => ({
      viewMode: true,
      student: prevState.studentInitialValues
    }))
  }

  handleUpdate = async () => {
    const updateObject = {}
    const notValidateFields = ["id", "course", "modality", "series"]
    const token = sessionStorage.getItem('token');
    let alertSettings = {}

    for (let prop in this.state.student) {
      if (!notValidateFields.includes(prop))
        updateObject[prop] = this.state.student[prop]
    }

    const data = await api.put(`/student/${this.state.student.id}`, updateObject, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    alertSettings = (200 <= data.status && data.status <= 299) ?
      ({
        open: true,
        alertTitle: "Sucesso",
        alertMessage: "Dados do aluno foram atualizados com sucesso.",
        alertSeverity: "success"
      }) : ({
        open: true,
        alertTitle: "Erro",
        alertMessage: "Erro ao atualizar dados do aluno.",
        alertSeverity: "error"
      })

    this.setState(prevState => ({
      viewMode: true,
      studentInitialValues: prevState.student,
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
              marginLeft: this.state.student ? (this.state.menuOpen ? "0" : "-25vw") : "-25w"
            }}>
            {this.state.student ? (
              <>
                <div className="profile">
                  <div className="profile-img">
                    <Image src={require(`../../../../backend/app/uploads/${this.state.student.path}`)} />
                  </div>
                  <h2 className="profile-name">{this.state.student.name}</h2>
                  <h2 className="profile-enrollment">{this.state.student.enrollment}</h2>
                </div>

                <div className="options-menu">
                  <hr className="divider rounded" />
                  <Link to={`/studentProfile/${this.state.student.id}`}>
                    <div className="options-btn">
                      <span className="options-btn-label">Visualizar Perfil</span>
                    </div>
                  </Link>
                  <a href="attendance.html">
                    <div className="options-btn">
                      <span className="options-btn-label">Fazer Atendimento</span>
                    </div>
                  </a>
                </div>
                <span className="campus-name"><a href="login.html">Campus Divinópolis</a></span>
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
                <Dropdown.Item eventKey="1">Ver Perfil</Dropdown.Item>
                <Dropdown.Item eventKey="2">Virada de Ano</Dropdown.Item>
                <Dropdown.Item eventKey="3">Virada de Ano Escolar</Dropdown.Item>
                <Dropdown.Item eventKey="4">Gerenciar Pedagogos</Dropdown.Item>
              </DropdownButton>
            </Navbar>

            <div className="student-profile">
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
                        value={(this.state.student) ? this.state.student.name : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ name: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Matrícula</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Matrícula"
                        value={(this.state.student) ? this.state.student.enrollment : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ enrollment: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Idade</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Idade"
                        value={(this.state.student) ? this.state.student.age : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ age: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Modalidade</Form.Label>
                      <Form.Control
                        required
                        disabled
                        type="text"
                        placeholder="Modalidade"
                        value={(this.state.student) ? this.state.student.modality : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ modality: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Curso</Form.Label>
                      <Form.Control
                        required
                        disabled
                        type="text"
                        placeholder="Curso"
                        value={(this.state.student) ? this.state.student.course : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ course: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Série</Form.Label>
                      <Form.Control
                        required
                        disabled
                        type="text"
                        placeholder="Série"
                        value={(this.state.student) ? this.state.student.series : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ series: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Ano entrada</Form.Label>
                      <Form.Control
                        required
                        disabled
                        type="text"
                        placeholder="Ano de entrada"
                        value={(this.state.student) ? this.state.student.yearEntry : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ yearEntry: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Problemas de saúde</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Problemas de saúde"
                        value={(this.state.student) ? this.state.student.healthProblems : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ healthProblems: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Cidade de origem</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Cidade de origem"
                        value={(this.state.student) ? this.state.student.originCity : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ originCity: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Mora com</Form.Label>
                      <Form.Control
                        required
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Mora com"
                        value={(this.state.student) ? this.state.student.liveWith : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ liveWith: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>

              <h3 className="group-title">Outras Informações</h3>
              <div className="group-infos">
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Nome do Pai</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Nome do Pai"
                        value={(this.state.student) ? this.state.student.nameFather : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ nameFather: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Profissão do Pai</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Profissão do Pai"
                        value={(this.state.student) ? this.state.student.professionFather : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ professionFather: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Tel. do Pai</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Contato do Pai"
                        value={(this.state.student) ? this.state.student.contactFather : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ contactFather: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Nome da Mãe</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Nome da Mãe"
                        value={(this.state.student) ? this.state.student.nameMom : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ nameMom: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={4}>
                      <Form.Label>Profissão da Mãe</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Profissão da Mãe"
                        value={(this.state.student) ? this.state.student.professionMom : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ professionMom: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={2}>
                      <Form.Label>Tel. da Mãe</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Contato da Mãe"
                        value={(this.state.student) ? this.state.student.contactMom : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ contactMom: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Fez Pré-CEFET</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Fez Pré-CEFET"
                        value={(this.state.student) ? this.state.student.preCefet : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ preCefet: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Última Escola</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Última Escola"
                        value={(this.state.student) ? this.state.student.lastSchool : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ lastSchool: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Atividades Extras</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Atividades Extras"
                        value={(this.state.student) ? this.state.student.extraActivities : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ extraActivities: e.target.value })
                          } : null
                        }
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={6}>
                      <Form.Label>Fez Parte do Ensino Médio</Form.Label>
                      <Form.Control
                        disabled={this.state.viewMode ? true : false}
                        type="text"
                        placeholder="Fez Parte do Ensino Médio"
                        value={(this.state.student) ? this.state.student.highSchool : ""}
                        onChange={
                          (!this.state.viewMode) ? (e) => {
                            this.updateStudent({ highSchool: e.target.value })
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