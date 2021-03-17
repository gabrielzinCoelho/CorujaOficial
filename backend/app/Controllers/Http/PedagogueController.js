'use strict'
//REAFTORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const Database = use('Database')

class PedagogueController{

  async store({request, response}) {

    const requiredFields = ["name", "password", "cpf", "email", "file_id"]

    for (let field of requiredFields){
      if(!(field in request.body))
        return response.status(406).json({
          error: `Campo '${field}' é obrigatório para este processo.`
        })
    }

    const pedagogue = new Pedagogue()
    pedagogue.name = request.body.name
    pedagogue.email = request.body.email
    pedagogue.cpf = request.body.cpf
    pedagogue.password = request.body.password
    pedagogue.file_id = request.body.file_id

    await pedagogue.save()

    return pedagogue

  }


}

module.exports = PedagogueController
