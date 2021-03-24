import React, { Component } from 'react'
import { Image, Navbar, Dropdown, DropdownButton, Table, Button } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class NewYear extends Component {
  state = {
    newYear: null,
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
    const token = sessionStorage.getItem('token');

    const newYear = await api.get(`/newYear/status`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYear: newYear.data })
  }


  handleDeleteTurn = async (id, type) => {
    const token = sessionStorage.getItem('token');
    let alertSettings = {}

    const data = await api.delete(`/newYear/${type}/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    alertSettings = (200 <= data.status && data.status <= 299) ?
      ({
        open: true,
        alertTitle: "Sucesso",
        alertMessage: "Virada desfeita com sucesso.",
        alertSeverity: "success"
      }) : ({
        open: true,
        alertTitle: "Erro",
        alertMessage: "Erro ao desfazer virada.",
        alertSeverity: "error"
      })

    this.setState({ alertSettings })
  }

  async componentDidUpdate(prevProps, prevState) {
    const token = sessionStorage.getItem('token');

    const newYear = await api.get(`/newYear/status`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYear: newYear.data })
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

        <div className="new-year">
          <Navbar className="top-bar">
            <a href="/carograph">
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
                <div className="tables">
                  <div>
                    {
                      this.state.newYear.map(course => (
                        <>
                          <h3 className="course-name">{course.course}</h3>
                          <Table className="course-table" responsive="sm">
                            <thead>
                              <tr>
                                <th className="table-titles">Curso</th>
                                <th className="table-titles">Série</th>
                                <th className="table-titles">Status</th>
                                <th className="table-titles">Fazer virada</th>
                                <th className="table-titles">Excluir virada</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                course.series.map(serie => (
                                  <tr>
                                    <td>{course.course}</td>
                                    <td>{serie.series}</td>
                                    <td>{serie.newYearStatus ? "Virada" : "Não virada"}</td>
                                    <td>
                                      <Button
                                        className="table-button"
                                        disabled={serie.newYearStatus}
                                        href={`/newYearWorksheet/${serie.class_id}`}
                                      >
                                        Fazer virada
                                      </Button>
                                    </td>
                                    <td>
                                      <Button
                                        className="table-button"
                                        disabled={!serie.newYearStatus}
                                        onClick={() => this.handleDeleteTurn(serie.class_id, "class")}
                                        style={{ color: "rgb(250, 59, 59)" }
                                        }>
                                        Desfazer virada
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              }
                              <tr>
                                <td>{course.course}</td>
                                <td>Calouros</td>
                                <td>{course.nextClassStatus ? "Virada" : "Não virada"}</td>
                                <td>
                                  <Button
                                    className="table-button"
                                    disabled={course.nextClassStatus}
                                    href={`/newYearCourseWorksheet/${course.course}/${course.course_id}`}
                                  >
                                    Fazer virada
                                      </Button>
                                </td>
                                <td>
                                  <Button
                                    className="table-button"
                                    disabled={!course.nextClassStatus}
                                    onClick={() => this.handleDeleteTurn(course.course_id, "course")}
                                    style={{ color: "rgb(250, 59, 59)" }
                                    }>
                                    Desfazer virada
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) :
              <p>Erro</p>
          }
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