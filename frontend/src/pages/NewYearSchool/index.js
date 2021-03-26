import React, { Component } from 'react'
import { Image, Navbar, Dropdown, DropdownButton, ButtonGroup, Button, Col } from 'react-bootstrap'

import api from '../../services/api'
import Alert from '../../pages/components/Alert'
import Authentication from '../components/Authentication'
import './style.css'

export default class NewYearSchool extends Component {
  state = {
    newYearSchool: null,

    alertSettings: {
      open: false,
      alertTitle: "",
      alertMessage: "",
      alertSeverity: "success"
    }
  }

  async componentDidMount() {
    const token = sessionStorage.getItem('token');

    const newYearSchool = await api.get(`/newYearSchool/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYearSchool: newYearSchool.data })
  }

  turnYear = async () => {
    const token = sessionStorage.getItem('token');
    let alertSettings = {}

    const data = await api.put(`/newYearSchool`, { year: this.state.newYearSchool.yearSchool + 1 }, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    alertSettings = (200 <= data.status && data.status <= 299) ?
      ({
        open: true,
        alertTitle: "Sucesso",
        alertMessage: "Ano escolar virado com sucesso.",
        alertSeverity: "success"
      }) : ({
        open: true,
        alertTitle: "Erro",
        alertMessage: "Erro ao virar ano escolar.",
        alertSeverity: "error"
      })

    this.setState(prevState => ({
      alertSettings
    }))
  }

  async componentDidUpdate(prevProps, prevState) {
    const token = sessionStorage.getItem('token');

    const newYearSchool = await api.get(`/newYearSchool/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    this.setState({ newYearSchool: newYearSchool.data })
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

        <div className="new-year-school-page">
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
              <Dropdown.Item href="/newYear">Virada de Ano</Dropdown.Item>
              <Dropdown.Item href="/carograph">Ver Carógrafo</Dropdown.Item>
              <Dropdown.Item id="quit" href="/" onClick={() => sessionStorage.clear()}>Sair</Dropdown.Item>
            </DropdownButton>
          </Navbar>

          {
            this.state.newYearSchool ? (
              <div className="page-content">
                <div className="content">
                  <h1 className="year-school">{this.state.newYearSchool.yearSchool}</h1>
                  <Button className="turn" onClick={this.turnYear} disabled={!this.state.newYearSchool.canTurn}>Virar</Button>
                </div>
              </div>
            ) :
              <div className="page-content">
                <div className="content">
                  <h1 className="year-school">Erro</h1>
                </div>
              </div>
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