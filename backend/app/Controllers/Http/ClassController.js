'use strict'

const Class = use('App/Models/Class')
const Database = use('Database')

class ClassController {

  async index({request, response}){

    const {course_id, series} = request.params

    const classInstance = await Database.from('classes').where({
      course_id,
      series
    })

    if(!classInstance)
      return response.status(406).json({error: "Classe não encontrada."})

    return classInstance

  }

}

module.exports = ClassController
