import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import api from '../../services/api'
// import './index.css'
import Authentication from '../components/Authentication'

export default class Old extends Component {

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
        maxYear: 2022


    }

    async componentDidMount() {

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

    async componentDidUpdate(prevProps, prevState) {
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

    render() {
        return (
            <div className="Carograph">
                <Authentication redirectWhenLogged={false} redirectUrl="/" />
                <nav className="side-menu">
                    {this.state.studentSelectedId ? (
                        <>
                            <div className="profile">
                                <div className="profile-img">
                                    <img src={require('../../assets/gabriel2.jpg')} alt=""/>
                                </div>
                                {
                                    (()=>{
                                        for(let i=0;i<this.state.students.length;i++){
                                            if(this.state.students[i].student_id == this.state.studentSelectedId){
                                                return (
                                                    <>
                                                        <h2 className="profile-name">{this.state.students[i].name}</h2>
                                                        <h2 className="profile-name">{this.state.students[i].enrollment}</h2>
                                                    </>
                                                )
                                            }
                                        }
                                    })()
                                }
                            </div>
                            <div className="options-menu">
                                <h4 className="options-title">Opções</h4>
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
                            <span className="campus-name"><a href="login.html">Campus Divinópolis</a></span>
                        </>
                    ) : (
                            <>
                                <img src={require('../../assets/owl-animation.jpg')} alt="" />
                            </>
                        )}
                </nav>

                <section className="page-content">
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