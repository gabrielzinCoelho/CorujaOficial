import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Image, Navbar, Dropdown, DropdownButton, Table, Button, Form } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class NewYearWorksheet extends Component {
  state = {
    newYear: null,
    statusObject: {},
    redirect: false,

    alertSettings: {
      open: false,
      alertTitle: "",
      alertMessage: "",
      alertSeverity: "success"
    }
  }

  async componentDidMount() {
    const token = sessionStorage.getItem('token');
    const { id } = this.props.match.params

    const newYear = await api.get(`/newYear/class/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYear: newYear.data })
  }

  handleUpdateStatus = (id, value) => {
    const newObject = this.state.newYear

    for (let i = 0; i < newObject.students.length; i++) {
      if (newObject.students[i].student_id == id) {
        newObject.students[i].status_id = parseInt(value)
        this.setState({ newYear: newObject })
      }
    }
  }

  handleTurnYear = async () => {
    const token = sessionStorage.getItem('token');
    let newNewYear = this.state.newYear
    let statusObject = {}
    let alertSettings = {}

    this.state.newYear.statusStudents.map(status => {
      statusObject[status.status_id] = []
    })

    this.state.newYear.students.map((student, index) => {
      statusObject[student.status_id].push(student.student_id)
      delete newNewYear.students[index].status_id
    })

    newNewYear.statusStudents.map((status, index) => {
      newNewYear.statusStudents[index].students_id = statusObject[status.status_id]
    })

    const data = await api.post(`/newYear`, newNewYear, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    alertSettings = (200 <= data.status && data.status <= 299) ?
      ({
        open: true,
        alertTitle: "Sucesso",
        alertMessage: "Virada de ano realizada com sucesso.",
        alertSeverity: "success"
      }) : ({
        open: true,
        alertTitle: "Erro",
        alertMessage: "Erro ao realizar virada de ano.",
        alertSeverity: "error"
      })

    this.setState(prevState => ({ alertSettings }))
  }

  handleCloseAlert = () => {
    this.setState(prevState => ({
      alertSettings: {
        ...prevState.alertSettings,
        ...{ open: false }
      },
      redirect: true
    }))
  }

  render() {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <Authentication redirectWhenLogged={false} redirectUrl="/" />

        <div className="new-year-worksheet">
          <Navbar className="top-bar">
            <a href="/newYear">
              <Button variant="light" className="back-button">
                <i class="fa fa-arrow-left"></i>
              </Button>
            </a>

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
              <Dropdown.Item href={`/pedagogueProfile/${sessionStorage.getItem('id')}`}>Ver Perfil</Dropdown.Item>
              <Dropdown.Item href="/newYearSchool">Ano Escolar</Dropdown.Item>
              <Dropdown.Item>Gerenciar Pedagogos</Dropdown.Item>
              <Dropdown.Item href="/carograph">Ver Carógrafo</Dropdown.Item>
              <Dropdown.Item id="quit" href="/" onClick={() => sessionStorage.clear()}>Sair</Dropdown.Item>
            </DropdownButton>
          </Navbar>

          {
            this.state.newYear ? (
              <div className="page-content">
                <div className="worksheet">
                  <h3 className="course-name">{`${this.state.newYear.modality} em ${this.state.newYear.course} - ${this.state.newYear.series}º ano`}</h3>
                  <Table className="course-table" responsive="sm">
                    <thead>
                      <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Matricula</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.newYear.students.map(student => (
                          <>
                            <tr>
                              <td className="student-info"><Image className="student-image" src={require(`../../../../backend/app/uploads/${student.path}`)} /></td>
                              <td className="student-info">{student.name}</td>
                              <td className="student-info">{student.enrollment}</td>
                              <td className="student-info">
                                <Form>
                                  <Form.Group style={{ width: '100%' }} className="select-item">
                                    <Form.Control as="select" style={{ width: '100%' }} custom disabled={this.state.disabledModality}
                                      onChange={(e) => this.handleUpdateStatus(student.student_id, e.target.value) }
                                    >
                                      {
                                        (() => {
                                          let statusOptions = []
                                          statusOptions.push(<option value={null}>Status:</option>)
                                          for (let status of this.state.newYear.statusStudents) {
                                            status.status_id == student.status_id ?
                                              statusOptions.push(<option selected value={status.status_id}>{status.status}</option>) :
                                              statusOptions.push(<option value={status.status_id}>{status.status}</option>)
                                          }

                                          return statusOptions
                                        })()
                                      }
                                    </Form.Control>
                                  </Form.Group>
                                </Form>
                              </td>
                            </tr>
                          </>
                        ))
                      }
                    </tbody>
                  </Table>
                  <Button className="profile-btn" onClick={this.handleTurnYear}>Enviar</Button>
                </div>
              </div>
            ) :
              <p>Erro</p>
          }
          {(() => { return (this.state.redirect) ? <Redirect push to='/newYear' /> : null })()}
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