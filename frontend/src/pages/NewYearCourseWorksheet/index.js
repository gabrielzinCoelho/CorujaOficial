import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Image, Navbar, Dropdown, DropdownButton, Table, Button, Form } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class NewYearWorksheet extends Component {
  state = {

    students: {},
    nextStudentId: null,
    course_id: null,
    modality: null,
    course: null,
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

    const responseData = await api.get(`/newYear/nextClass/course/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const numRows = 6

    const students = {}

    for(let i=1; i<=numRows; i++)
      students[i] =  {
        file: {},
        name: "",
        enrollment: "",
        previewFile: ""
      }

    this.setState({
      modality: responseData.data.modality,
      course: responseData.data.course,
      course_id: responseData.data.course_id,
      students,
      nextStudentId: numRows + 1,
    })
  }

  handleUpdateStudent = (student_id, forceValue) => {
    
    this.setState(prevState => ({
      students: {
        ...prevState.students,
        [student_id]: {
          ...prevState.students[student_id],
          ...forceValue
        }
      }
    }))

  }
  

  handleTurnYear = async () => {
    const token = sessionStorage.getItem('token');

    const students = []
    
    for(const studentId in this.state.students){

      if(!this.state.students[studentId].name)
        continue;

      const formData = new FormData()

      formData.append('file', this.state.students[studentId].file, this.state.students[studentId].file.name)

      const dataFile = await api.post(`/files`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }) 
      
      students.push({
        name: this.state.students[studentId].name,
        enrollment: this.state.students[studentId].enrollment,
        file_id: dataFile.data.fileId
      })

    }

    const data = await api.post(`/newYear/nextClass`, {
      course_id: this.state.course_id,
      students
    }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const alertSettings = (200 <= data.status && data.status <= 299) ?
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

    this.setState({
      alertSettings: alertSettings,
      redirect: true
    })
  }

  handleAddStudent = () => {

    this.setState(prevState => ({
      students: {
        ...prevState.students,
        [prevState.nextStudentId]: {
          file: {},
          name: "",
          enrollment: "",
        },
      },
      nextStudentId: prevState.nextStudentId + 1
    }))

  }

  handleDelStudent = (student_id) => {

    const students = this.state.students

    delete students[student_id]

    this.setState({
      students
    })

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
            this.state.modality ? (
              <div className="page-content">
                <div className="worksheet">
                  <h3 className="course-name">{`${this.state.modality} em ${this.state.course} - Calouros`}</h3>
                  <Table className="course-table" responsive="sm">
                    <thead>
                      <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Matricula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (() => {

                          const linesArray = []

                          for (const student_id in this.state.students) {

                            linesArray.push(<>
                              <tr>
                                <td className="student-info">

                                <Form.File
                                  onChange={(e) => this.handleUpdateStudent(student_id, {
                                    file: e.target.files[0],
                                    previewFile: URL.createObjectURL(e.target.files[0])
                                  })}
                                />
                                {

                                  (()=>{
                                    if(this.state.students[student_id].previewFile)
                                      return <Image 
                                              src={this.state.students[student_id].previewFile} 
                                              style = {{
                                                "max-width": "150px",
                                                "max-height": "150px"
                                              }}
                                            />
                                  })()

                                }
                                </td>
                                <td className="student-info">
                                  <Form.Group className="select-item">
                                    <Form.Control
                                      type="text"
                                      style={{ width: '100%' }}
                                      onChange={(e) => this.handleUpdateStudent(student_id, {
                                        name: e.target.value
                                      })}
                                      value={this.state.students[student_id].name}
                                      placeholder="Nome do aluno"
                                    >
                                    </Form.Control>
                                  </Form.Group>
                                </td>
                                <td className="student-info">
                                  <Form.Group className="select-item">
                                    <Form.Control
                                      type="text"
                                      style={{ width: '100%' }}
                                      onChange={(e) => this.handleUpdateStudent(student_id, {
                                        enrollment: e.target.value
                                      })}
                                      value={this.state.students[student_id].enrollment}
                                      placeholder="Matrícula"
                                    >
                                    </Form.Control>
                                  </Form.Group>
                                </td>
                                <td><Button className="table-button" onClick={()=>this.handleDelStudent(student_id)}>Deletar</Button></td>
                              </tr>
                            </>)

                          }

                          return linesArray

                        })()
                      }
                      <tr>
                        <Button className="table-button" onClick={this.handleAddStudent}>Adiconar</Button>
                      </tr>                  
                    </tbody>
                  </Table>
                  <Button className="submit-btn" onClick={this.handleTurnYear}>Realizar virada</Button>
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