'use strict'
//REAFTORAÇÃO (OK)
const Course = use('App/Models/Course')
const Database = use('Database')

class CourseController{

  async index({request, response}){

    const {modality_id} = request.params

    const courses = await Database.from('courses').where({
      modality_id
    })

    if(!courses || courses.length < 1)
      return response.status(406).json({error: "Modalidade não encontrada."})

    return courses

  }


}

module.exports = CourseController
