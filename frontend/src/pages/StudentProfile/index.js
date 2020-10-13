import React, { Component } from 'react'

import api from '../../services/api';
import './index.css'

import Alert from '../../pages/components/Alert'

export default class StudentProfile extends Component {

    state = {

        student: null,
        studentInitialValues: null,
        viewMode: true,

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
        let alertSettings = {}

        for (let prop in this.state.student) {
            if (!notValidateFields.includes(prop))
                updateObject[prop] = this.state.student[prop]
        }

        const token = sessionStorage.getItem('token');

        const data = await api.put(`/student/${this.state.student.id}`, updateObject, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        alertSettings = (200 <= data.status && data.status <= 299) ?
            ({
                open: true,
                alertTitle: "Sucesso",
                alertMessage: "Dados do aluno foram atualizados com sucesso",
                alertSeverity: "success"
            }) : ({
                open: true,
                alertTitle: "Erro",
                alertMessage: "Erro ao atualizar dados do aluno",
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
                <div className="container-student-profile">
                    <nav className="side-menu">
                        <div className="profile">
                            <div className="profile-img">
                                <img src={require('../../assets/gabriel2.jpg')} alt="" />
                            </div>
                            <h2 className="profile-name">
                                {
                                    (this.state.student) ? this.state.student.name : null
                                }
                            </h2>
                            <h2 className="profile-name">
                                {
                                    (this.state.student) ? this.state.student.enrollment : null
                                }
                            </h2>
                        </div>
                        <div className="options-menu">
                            <h4 className="options-title">Opções</h4>
                            <a href="#">
                                <div className="options-btn">
                                    <span className="options-btn-label">Visualizar Perfil</span>
                                </div>
                            </a>
                            <a href="attendance.html">
                                <div className="options-btn">
                                    <span className="options-btn-label">Fazer Atendimento</span>
                                </div>
                            </a>
                        </div>
                        <span className="campus-name"><a href="login.html">Campus Divinópolis</a></span>
                    </nav>
                    <section className="page-content">
                        <div className="menu-bar">
                            <div className="menu-item">
                                <a href="carograph.html"><img src={require('../../assets/voltar.png')} alt="" /></a>
                            </div>
                            <div className="menu-item" id="click">
                                <a href="#">Dados Gerais</a>
                            </div>
                            <div className="menu-item">
                                <a href="student_profile2.html">Atendimentos</a>
                            </div>
                            <div className="menu-item">
                                <a href="#">Notas</a>
                            </div>
                            <img className="pedagogue-img" src={require('../../assets/gabriel1.jpg')} alt="" />
                        </div>
                        <div className="info">
                            <div className="data">
                                <div id="info-data" className="section">
                                    <h3>Informações Pessoais</h3>
                                    <div className="items" style={{ padding: "5px" }}>
                                        <div className="row">
                                            <div className="item">
                                                <b>Nome </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.name : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ name: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Matrícula </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.enrollment : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ enrollment: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Idade </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.age : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ age: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                <b>Curso </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? `${this.state.student.modality} - ${this.state.student.course}` : ""}
                                                        readOnly
                                                        onChange={null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Série </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.series : ""}
                                                        readOnly
                                                        onChange={null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Ano de Entrada </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.yearEntry : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ yearEntry: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                <b>Mora com </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.liveWith : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ liveWith: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Cidade de Origem </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.originCity : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ originCity: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Problemas de Saúde </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.healthProblems : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ healthProblems: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="resp-data" className="section">
                                    <h3>Informações dos Responsáveis</h3>
                                    <div className="items" style={{ padding: "5px" }}>
                                        <div className="row">
                                            <div className="item">
                                                <b>Nome do Pai </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.nameFather : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ nameFather: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Profissão do Pai </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.professionFather : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ professionFather: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                <b>Nome da Mãe </b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.nameMom : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ nameMom: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Profissão da Mãe</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.professionMom : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ professionMom: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                <b>Contato do Pai</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.contactFather : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ contactFather: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Contato da Mãe</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.contactMom : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ contactMom: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="school-data" className="section">
                                    <h3>Escolaridade</h3>
                                    <div className="items" style={{ padding: "5px" }}>
                                        <div className="row">
                                            <div className="item">
                                                <b>Fez Pré-CEFET</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.preCefet : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ preCefet: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Última Escola</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.lastSchool : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ lastSchool: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                <b>Atividades Extras</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.extraActivities : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ extraActivities: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                            <div className="item">
                                                <b>Fez Parte do Ensino Médio</b>
                                                <p>
                                                    <input
                                                        type="text"
                                                        value={(this.state.student) ? this.state.student.highSchool : ""}
                                                        onChange={(!this.state.viewMode) ? (e) => {
                                                            this.updateStudent({ highSchool: e.target.value })
                                                        } : null}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.viewMode) ?
                                    (<button type="button" onClick={this.goToEditMode}>Editar</button>)
                                    :
                                    (<>
                                        <button type="button" onClick={this.cancelEdit}>Cancelar</button>
                                        <button type="button" onClick={this.handleUpdate}>Salvar</button>
                                    </>)
                            }
                        </div>
                    </section>
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