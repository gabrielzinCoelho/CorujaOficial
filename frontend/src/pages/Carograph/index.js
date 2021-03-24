import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Image, Navbar, Form, Button, Card, Dropdown, DropdownButton } from 'react-bootstrap'

import api from '../../services/api'
import Authentication from '../components/Authentication'
import './style.css'

export default class Carograph extends Component {
  state = {
    modalityOptions: [],
    courseOptions: [],

    menuOpen: false,
    modalitySelectedId: null,
    disabledModality: false,
    courseSelectedId: null,
    disabledCourse: true,
    seriesSelected: null,
    disabledSeries: true,
    yearSelected: null,
    disabledYear: true,

    students: [],
    studentSelectedId: null,

    minYear: null,
    maxYear: null
  }

  async componentDidMount() {
    const token = sessionStorage.getItem('token');

    //buscar opções de modalidade, curso, série e ano
    const modalities = await api.get('/modalities', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({
      modalityOptions: modalities.data
    })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.modalitySelectedId !== this.state.modalitySelectedId) {

      const token = sessionStorage.getItem('token');

      const courses = await api.get(`/courses/modality/${this.state.modalitySelectedId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      this.setState({
        courseOptions: courses.data
      })
    }

    if (prevState.seriesSelected !== this.state.seriesSelected && this.state.seriesSelected) {

      const token = sessionStorage.getItem('token');


      const classInstance = await api.get(`/class/course/${this.state.courseSelectedId}/series/${this.state.seriesSelected}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const { lastClassYear: maxYear, firstClassYear: minYear } = classInstance.data[0]

      this.setState({
        minYear,
        maxYear
      })
    }

    if (prevState.yearSelected !== this.state.yearSelected) {

      const token = sessionStorage.getItem('token');

      const carograph = await api.get(
        `/carograph/course/${this.state.courseSelectedId}/series/${this.state.seriesSelected}/year/${this.state.yearSelected}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      const data = (carograph.data.students) ? carograph.data.students : []
      this.setState({
        students: data
      })
    }

  }

  render() {
    return (
      <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <Authentication redirectWhenLogged={false} redirectUrl="/" />

        <div className="carograph-page">
          <div className="side-menu"
            style={{
              marginLeft: this.state.studentSelectedId ? (this.state.menuOpen ? "0" : "-25vw") : "-25vw"
            }}>
            {this.state.studentSelectedId ? (
              <>
                {
                  (() => {
                    for (let i = 0; i < this.state.students.length; i++) {
                      if (this.state.students[i].student_id == this.state.studentSelectedId) {
                        return (
                          <>
                            <div className="profile">
                              <div className="profile-img">
                                <Image src={require(`../../../../backend/app/uploads/${this.state.students[i].path}`)} />
                              </div>
                              <h2 className="profile-name">{this.state.students[i].name}</h2>
                              <h2 className="profile-enrollment">{this.state.students[i].enrollment}</h2>
                            </div>
                          </>
                        )
                      }
                    }
                  })()
                }

                <div className="options-menu">
                  <hr className="divider rounded" />
                  <Link to={`/studentProfile/${this.state.studentSelectedId}`}>
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
                <span className="campus-name"><a href="#">Campus Divinópolis</a></span>
              </>
            ) : (
              <>
                <Image className="without-content" src={require('../../assets/logo.png')} />
              </>
            )}
          </div>

          <div className="page-content">
            <Navbar className="select-bar">
              <Button variant="light" className="menu-button"
                disabled={this.state.studentSelectedId ? 0 : 1}
                onClick={(e) => {
                  this.setState({
                    menuOpen: !this.state.menuOpen,
                  })
                }}
              >
                <i class="fa fa-bars"></i>
              </Button>
              <div className="select-filter">
                <Form inline>
                  <Form.Group className="select-item">
                    <Form.Control as="select" custom disabled={this.state.disabledModality}
                      onChange={(e) => {
                        this.setState({
                          modalitySelectedId: e.target.value,
                          courseSelectedId: null,
                          disabledCourse: Number.isInteger(parseInt(e.target.value)) ? false : true,
                          seriesSelected: null,
                          disabledSeries: true,
                          yearSelected: null,
                          disabledYear: true,
                        })
                      }}
                    >
                      {
                        (() => {
                          if (this.state.modalityOptions.length > 0) {
                            let arrayModalities = []
                            arrayModalities.push(<option value={null}>Forma:</option>)

                            for (let j = 0; j < this.state.modalityOptions.length; j++) {
                              if (this.state.modalitySelectedId == this.state.modalityOptions[j].id)
                                arrayModalities.push(<option selected value={this.state.modalityOptions[j].id}>{this.state.modalityOptions[j].name}</option>)
                              else
                                arrayModalities.push(<option value={this.state.modalityOptions[j].id}>{this.state.modalityOptions[j].name}</option>)
                            }

                            return arrayModalities
                          }

                          return <option selected>Forma:</option>
                        })()
                      }
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="select-item">
                    <Form.Control as="select" custom disabled={this.state.disabledCourse}
                      onChange={(e) => {
                        this.setState({
                          courseSelectedId: e.target.value,
                          seriesSelected: null,
                          disabledSeries: Number.isInteger(parseInt(e.target.value)) ? false : true,
                          yearSelected: null,
                          disabledYear: true,
                        })
                      }}
                    >
                      {
                        (() => {
                          if (this.state.courseOptions.length > 0 && this.state.modalitySelectedId) {
                            let arrayCourses = []
                            arrayCourses.push(<option value={null}>Curso:</option>)

                            for (let j = 0; j < this.state.courseOptions.length; j++) {
                              if (this.state.courseSelectedId == this.state.courseOptions[j].id)
                                arrayCourses.push(<option selected value={this.state.courseOptions[j].id}>{this.state.courseOptions[j].name}</option>)
                              else
                                arrayCourses.push(<option value={this.state.courseOptions[j].id}>{this.state.courseOptions[j].name}</option>)
                            }

                            return arrayCourses
                          }

                          return <option selected>Curso:</option>
                        })()
                      }
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="select-item">
                    <Form.Control as="select" custom disabled={this.state.disabledSeries}
                      onChange={(e) => {
                        this.setState({
                          seriesSelected: e.target.value,
                          yearSelected: null,
                          disabledYear: Number.isInteger(parseInt(e.target.value)) ? false : true,
                        })
                      }}
                    >
                      {
                        (() => {
                          if (this.state.courseOptions.length > 0 && this.state.courseSelectedId) {
                            let arraySeries = []
                            arraySeries.push(<option selected value={null} >Série:</option>)

                            for (let j = 0; j < this.state.courseOptions.length; j++) {
                              if (this.state.courseOptions[j].id == this.state.courseSelectedId) {
                                for (let i = 1; i <= this.state.courseOptions[j].duration; i++) {
                                  if (this.state.seriesSelected == i)
                                    arraySeries.push(<option selected value={i}>{i}°</option>)
                                  else
                                    arraySeries.push(<option value={i}>{i}°</option>)
                                }

                                return arraySeries
                              }
                            }
                          }

                          return <option selected>Série:</option>
                        })()
                      }
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="select-item">
                    <Form.Control as="select" custom disabled={this.state.disabledYear}
                      onChange={(e) => {
                        this.setState({
                          yearSelected: e.target.value,
                          students: [],
                          studentSelectedId: null
                        })
                      }}
                    >
                      {
                        (() => {
                          if (this.state.seriesSelected) {
                            let arrayYears = []
                            arrayYears.push(<option value={null}>Ano:</option>)

                            for (let j = this.state.minYear; j <= this.state.maxYear; j++) {
                              if (this.state.yearSelected == j)
                                arrayYears.push(<option selected value={j}>{j}</option>)
                              else
                                arrayYears.push(<option value={j}>{j}</option>)
                            }

                            return arrayYears
                          }

                          return <option selected>Ano:</option>
                        })()
                      }
                    </Form.Control>
                  </Form.Group>
                </Form>
              </div>

              <DropdownButton
                drop="left"
                title={<Image className="pedagogue-img" src={(path => {
                  path = path ? path : "default.jpg"

                  return require(`../../../../backend/app/uploads/${path}`)
                })(sessionStorage.getItem('path'))} alt="" />}
              >
                <Dropdown.Item href={`/pedagogueProfile/${sessionStorage.getItem('id')}`}>Ver Perfil</Dropdown.Item>
                <Dropdown.Item href="/newYear">Virada de Ano</Dropdown.Item>
                <Dropdown.Item href="/newYearSchool">Ano Escolar</Dropdown.Item>
                <Dropdown.Item>Gerenciar Pedagogos</Dropdown.Item>
                <Dropdown.Item id="quit" href="/" onClick={() => sessionStorage.clear()}>Sair</Dropdown.Item>
              </DropdownButton>
            </Navbar>

            <div className="carograph">
              <div className="students-container">
                {
                  this.state.students.map(student => (
                    <Card className="student" id={student.student_id} onClick={() => {
                      this.setState({
                        studentSelectedId: student.student_id,
                        menuOpen: true,
                      })
                    }}>
                      <div className="student-img">
                        <Card.Img variant="top" src={require(`../../../../backend/app/uploads/${student.path}`)} />
                      </div>
                      <Card.Title className="student-name"><p>{student.name}</p></Card.Title>
                      <Card.Text className="student-status" style={{
                        color: student.status_id === 1 ? "green" : (student.status_id === 5 ? "green" : "red")
                      }}>
                        {
                          (student.year != student.statusYear) ?
                            <p>{student.status} ({student.statusYear})</p>
                            :
                            <p>{student.status}</p>
                        }
                      </Card.Text>
                    </Card>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}