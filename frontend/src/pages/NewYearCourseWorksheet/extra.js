import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Image, Navbar, Dropdown, DropdownButton, Table, Button, Form } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class NewYearCourseWorksheet extends Component {
  state = {
    newYear: null,
    students: [{}, {}, {}, {}],
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

    const newYear = await api.get(`/newYear/nextClass/course/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYear: newYear.data })
  }

  handleTurnYear = async () => {
    const token = sessionStorage.getItem('token')
    let alertSettings = {}

    this.state.students.map(async (student, index) => {
      student.name ? 
        const fileInserted = await api.post(`/files`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }) 
      :

      this.state.students[index].file_id = fileInserted.data.file_id[0]
    })

    let newYear = {
      "course": this.state.newYear.course_id,
      "students": this.state.students
    }

    const data = await api.post(`/newYear/nextClass`, newYear, {
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

        <div className="new-year-course-worksheet">
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
                  <h3 className="course-name">{`${this.state.newYear.modality} em ${this.state.newYear.course} - Calouros`}</h3>
                  <Table className="course-table" responsive="sm">
                    <thead>
                      <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Matricula</th>
                        <th>Contato da Mãe</th>
                        <th>Contato do Pai</th>
                        <th>Adicionar/Deletar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.students.map((student, index) => (
                          <>
                            <tr>
                              <td className="student-info">
                                <Form>
                                  <Form.Group className="input-item">
                                    <Form.File
                                      style={{ width: '100%' }}
                                      label={

                                        (() => {
                                          let path = "default.jpg"
                                          if (student.previewFile)
                                            return <Image src={student.previewFile} style={{ "max-width": "150px", "max-height": "150px" }} />
                                          })()
  
                                      }
                                      onChange={
                                        (e) => {
                                          let students = this.state.students
                                          students[index].file = e.target.files[0]
                                          students[index].previewFile = URL.createObjectURL(e.target.files[0])
                                          this.setState({ students: students })
                                        }
                                      }
                                    />
                                  </Form.Group>
                                </Form>
                              </td>
                              <td className="student-info">
                                <Form>
                                  <Form.Group className="input-item">
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="Nome"
                                      value={student.name}
                                      onChange={
                                        (e) => {
                                          let students = this.state.students
                                          students[index].name = e.target.value
                                          this.setState({ students: students })
                                        }
                                      }
                                      style={{ width: '100%' }}
                                    />
                                  </Form.Group>
                                </Form>
                              </td>
                              <td className="student-info">
                                <Form>
                                  <Form.Group className="input-item">
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="Matrícula"
                                      value={student.enrollment}
                                      onChange={
                                        (e) => {
                                          let students = this.state.students
                                          students[index].enrollment = e.target.value
                                          this.setState({
                                            students: students
                                          })
                                        }
                                      }
                                      style={{ width: '100%' }}
                                    />
                                  </Form.Group>
                                </Form>
                              </td>
                              <td className="student-info">
                                <Form>
                                  <Form.Group className="input-item">
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="Contato da Mãe"
                                      value={student.contactMom}
                                      onChange={
                                        (e) => {
                                          let students = this.state.students
                                          students[index].contactMom = e.target.value
                                          this.setState({
                                            students: students
                                          })
                                        }
                                      }
                                    />
                                  </Form.Group>
                                </Form>
                              </td>
                              <td className="student-info">
                                <Form>
                                  <Form.Group className="input-item">
                                    <Form.Control
                                      required
                                      type="text"
                                      placeholder="Contato do Pai"
                                      value={student.contactFather}
                                      onChange={
                                        (e) => {
                                          let students = this.state.students
                                          students[index].contactFather = e.target.value
                                          this.setState({
                                            students: students
                                          })
                                        }
                                      }
                                    />
                                  </Form.Group>
                                </Form>
                              </td>
                              <td className="student-info">
                                {
                                  index != this.state.students.length - 1 ?
                                    <Button
                                      className="table-button"
                                      onClick={() => {
                                        let students = this.state.students
                                        delete students[index]

                                        this.setState({
                                          students: students
                                        })
                                      }}
                                    >
                                      Deletar
                                    </Button>
                                  :
                                    <Button
                                      className="table-button"
                                      onClick={() => {
                                        let students = this.state.students
                                        students[index + 1] = {}

                                        this.setState({
                                          students: students
                                        })
                                      }}
                                    >
                                      Adiconar
                                    </Button>
                                }
                              </td>
                            </tr>
                          </>
                        ))
                      }
                    </tbody>
                  </Table>
                  <Button className="submit-btn" onClick={this.handleTurnYear}>Enviar</Button>
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