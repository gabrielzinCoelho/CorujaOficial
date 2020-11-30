import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import api from '../../services/api'
import './style.css'
import Authentication from '../components/Authentication'

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
        minYear: 2000,
        maxYear: 2022,

        // styles
        iconMenuName: "close",
        sideMenuWidth: "25vw"

    }

    componentDidMount = async () => {

        const token = sessionStorage.getItem('token');

        //buscar opções de modalidade, curso, série e ano
        const modalities = await api.get('/modalities', {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        this.setState({
            modalityOptions: modalities.data
        })

    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevState.modalitySelectedId !== this.state.modalitySelectedId) {

            const token = sessionStorage.getItem('token');

            const courses = await api.get(`/courses/modality/${this.state.modalitySelectedId}`, {
                headers: {
                    "Authorization" : `Bearer ${token}`
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
                        "Authorization" : `Bearer ${token}`
                    }
                }
            )
            const data = (carograph.data.students) ? carograph.data.students : []
            this.setState({
                students: data
            })
        }
    }

    handleSideMenu = () => {
        this.setState({
            iconMenuName: this.state.iconMenuName === "keyboard_arrow_right" ? "close" : "keyboard_arrow_right",
            sideMenuWidth: this.state.iconMenuName === "keyboard_arrow_right" ? "25vw" : "0vw",
        })
    }

    render() {
        return (
            <>
                <Authentication redirectWhenLogged={false} redirectUrl="/" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"></link>
                <div className="carograph">
                    <div className="side-container" style={{
                        minWidth: this.state.sideMenuWidth,
                        maxWidth: this.state.sideMenuWidth,
                        padding: this.state.sideMenuWidth === "25vw" ? "30px" : "0px"
                    }}>
                        
                        <a class="close-menu-icon" onClick={ () => { this.handleSideMenu() } }>
                            <i class="material-icons">close</i>
                        </a>
                        <div className="profile">
                            <img className="profile-img" src={require('../../assets/gabriel2.jpg')} />
                            <h2 className="profile-name">Yuri Farnesio Sousa Silva</h2>
                            <h2 className="profile-enrollment">201815TII0351</h2>
                        </div>
                        <div className="options">
                            <Link to={`/studentProfile/${this.state.studentSelectedId}`}>
                                <button className="btn">
                                    <i class="material-icons-outlined prefix">visibility</i>
                                    Visualizar Perfil
                                </button>
                            </Link>
                            <Link to={`/attendance/${this.state.studentSelectedId}`}>
                                <button className="btn" style={{ margin: "0" }}>
                                    <i class="material-icons-outlined prefix">assignment_late</i>
                                    <p>Fazer Atendimento</p>
                                </button>
                            </Link>
                        </div>
                        <div className="campus">
                            <span className="campus-name"><a href="login.html">Campus Divinópolis</a></span>
                        </div>
                    </div>
                    <div className="page-content">
                        <a
                            class="open-menu-icon"
                            style={{ display: this.state.iconMenuName === "keyboard_arrow_right" ? "flex" : "none" }}
                            onClick={ () => { this.handleSideMenu() } }
                        >
                            <i class="material-icons">keyboard_arrow_right</i>
                        </a>
                        <div className="select-bar">
                        <div className="select-filter">
                            <div className="select-item">
                                <label>Forma: </label>
                                <select
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
                                            return <option selected disabled>None</option>

                                        })()
                                    }
                                </select>
                            </div>
                            <div className="select-item">
                                <label>Curso: </label>
                                <select
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
                                            return <option selected disabled>None</option>

                                        })()
                                    }
                                </select>
                            </div>
                            <div className="select-item">
                                <label>Série: </label>
                                <select
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
                                            return <option selected disabled>None</option>
                                        })()

                                    }
                                </select>
                            </div>
                            <div className="select-item">
                                <label>Ano: </label>
                                <select
                                    onChange={(e) => {
                                        this.setState({
                                            yearSelected: e.target.value,
                                            students:[],
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
                                            return <option selected disabled>None</option>

                                        })()
                                    }
                                </select>
                            </div>
                        </div>
                        <img className="pedagogue-img" src={require('../../assets/gabriel1.jpg')} alt="" />
                    </div>
                    </div>
                </div>
            </>
        )
    }

}