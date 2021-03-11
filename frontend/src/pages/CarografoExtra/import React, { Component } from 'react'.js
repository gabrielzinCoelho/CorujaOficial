import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Form, InputGroup, FormControl, Button } from 'react-bootstrap'

import api from '../../services/api'
import Authentication from '../components/Authentication'
import './style.css'

export default class Carograph extends Component {
  state = {
    modalityOptions: [],
    courseOptions: [],

    modalitySelectedId: null,
    courseSelectedId: null,
    seriesSelected: null,
    yearSelected: null,

    students: [],
    studentSelectedId: null,

    //gambiarra
    minYear: 2020,
    maxYear: 2022
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
      <div className="carograph">
        <Authentication redirectWhenLogged={false} redirectUrl="/" />

        <section className="page-content">
          <Navbar className="select-bar">
            <div className="select-filter">
              <Form inline>
                <Form.Group className="select-item" controlId="exampleForm.SelectCustom">
                  <Form.Label>Forma: </Form.Label>
                  <Form.Control as="select" custom
                    onChange={(e) => {
                      this.setState({
                        modalitySelectedId: e.target.value,
                        courseSelectedId: null,
                        seriesSelected: null,
                        yearSelected: null
                      })
                    }}
                  >
                    {
                      (() => {
                        if (this.state.modalityOptions.length > 0) {
                          let arrayModalities = []
                          arrayModalities.push(<option value={null}>Escolha aqui</option>)

                          for (let j = 0; j < this.state.modalityOptions.length; j++) {
                            if (this.state.modalitySelectedId == this.state.modalityOptions[j].id)
                              arrayModalities.push(<option selected value={this.state.modalityOptions[j].id}>{this.state.modalityOptions[j].name}</option>)
                            else
                              arrayModalities.push(<option value={this.state.modalityOptions[j].id}>{this.state.modalityOptions[j].name}</option>)
                          }

                          return arrayModalities
                        }

                        return <option selected disabled>Desabilitado</option>
                      })()
                    }
                  </Form.Control>
                </Form.Group>
              </Form>
              <Form inline>
                <Form.Group className="select-item" controlId="exampleForm.SelectCustom">
                  <Form.Label>Curso: </Form.Label>
                  <Form.Control as="select" custom
                    onChange={(e) => {
                      this.setState({
                        courseSelectedId: e.target.value,
                        seriesSelected: null,
                        yearSelected: null
                      })
                    }}
                  >
                    {
                      (() => {
                        if (this.state.courseOptions.length > 0 && this.state.modalitySelectedId) {
                          let arrayCourses = []
                          arrayCourses.push(<option value={null}>Escolha aqui</option>)

                          for (let j = 0; j < this.state.courseOptions.length; j++) {
                            if (this.state.courseSelectedId == this.state.courseOptions[j].id)
                              arrayCourses.push(<option selected value={this.state.courseOptions[j].id}>{this.state.courseOptions[j].name}</option>)
                            else
                              arrayCourses.push(<option value={this.state.courseOptions[j].id}>{this.state.courseOptions[j].name}</option>)
                          }

                          return arrayCourses
                        }

                        return <option selected disabled>Desabilitado</option>
                      })()
                    }
                  </Form.Control>
                </Form.Group>
              </Form>
              <Form inline>
                <Form.Group className="select-item" controlId="exampleForm.SelectCustom">
                  <Form.Label>Série: </Form.Label>
                  <Form.Control as="select" custom
                    onChange={(e) => {
                      this.setState({
                        seriesSelected: e.target.value,
                        yearSelected: null
                      })
                    }}
                  >
                    {
                      (() => {
                        if (this.state.courseOptions.length > 0 && this.state.courseSelectedId) {
                          let arraySeries = []
                          arraySeries.push(<option value={null} >Escolha aqui</option>)

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

                        return <option selected disabled>Desabilitado</option>
                      })()
                    }
                  </Form.Control>
                </Form.Group>
              </Form>
              <Form inline>
                <Form.Group className="select-item" controlId="exampleForm.SelectCustom">
                  <Form.Label>Ano: </Form.Label>
                  <Form.Control as="select" custom
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
                          arrayYears.push(<option value={null}>Escolha aqui</option>)

                          for (let j = this.state.minYear; j <= this.state.maxYear; j++) {
                            if (this.state.yearSelected == j)
                              arrayYears.push(<option selected value={j}>{j}</option>)
                            else
                              arrayYears.push(<option value={j}>{j}</option>)
                          }

                          return arrayYears
                        }
                        
                        return <option selected disabled>Desabilitado</option>
                      })()
                    }
                  </Form.Control>
                </Form.Group>
              </Form>
            </div>
            <img className="pedagogue-img" src={require('../../assets/gabriel1.jpg')} alt="" />
          </Navbar>

          <div class="carograph">
            <div class="students-container">
              {

                this.state.students.map(student => (
                  <div class="student" id={student.student_id} onClick={() => {
                    this.setState({
                      studentSelectedId: student.student_id
                    })
                  }}>
                    <img src={require('../../assets/gabriel1.jpg')} alt="" />
                    <div class="student_name">
                      <p>{student.name}</p>
                    </div>
                    <div class="student_name">
                      {
                        (student.year != student.statusYear) ?
                          <p>Status: {student.status} ({student.statusYear})</p>
                          :
                          <p>Status: {student.status}</p>
                      }
                    </div>
                  </div>
                ))

              }
            </div>
          </div>
        </section>
      </div>
    )
  }
}