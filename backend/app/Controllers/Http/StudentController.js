'use strict'
//REFATORAÇÃO OK
const Student = use('App/Models/Student')
const File = use('App/Models/File')
const Database = use('Database')

class StudentController {

  async index({ request, response }) {

    const { id } = request.params

    const student = await Database
      .raw(`select  s.id, s.name, s.enrollment, s.yearEntry, s.file_id, s.age, s.liveWith,
      s.originCity, s.healthProblems, s.nameFather, s.professionFather, s.contactFather, s.nameMom,
      s.professionMom, s.contactMom, s.lastSchool, s.extraActivities, s.preCefet, s.highSchool,
      co.name as course, cl.series as series, m.name as modality
      from students as s inner join student_historics as sh on s.id=sh.student_id inner join
      classes as cl on cl.id = sh.class_id
      inner join courses as co on co.id = cl.course_id inner join modalities as m on m.id = co.modality_id
       where s.id=? and sh.year=sh.statusYear order by sh.year desc limit 1;`, [id])

       let path = ""

       try{
         if(!student[0][0].file_id)
           throw "O estudante não possui foto cadastrada.";
         const fileInstance = await File.findOrFail(student[0][0].file_id)
         path = fileInstance.path
       }catch(error){
         path = "default.jpg"
       }

    if(!student || student[0].length < 1)
      return response.status(406).json({
        error: "Nenhum aluno com esse id foi identificado."
      })

    return {...student[0][0], path}

  }

  async update({request, response}) {

    const updateFields = ["name", "enrollment", "yearEntry", "file_id", "age", "liveWith", "originCity", "healthProblems", "nameFather", "professionFather", "contactFather", "nameMom", "professionMom", "contactMom", "lastSchool", "extraActivities", "preCefet", "highSchool"]

    let checkFields = false
    for (let field of updateFields){
      if(field in request.body){
        checkFields = true
        break;
      }
    }

    if(!checkFields)
      return response.status(406).json({
        error: `Ao menos um dos campos do aluno deve ser atualizado.`
      })

    const {id} = request.params

    const affectedRows = await Database
      .table('students')
      .where({id})
      .update(request.body)

     return response.status(200).json({
       message: "Êxito na requisição",
       affectedRows
     })

  }


}

module.exports = StudentController
