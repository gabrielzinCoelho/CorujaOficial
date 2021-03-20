'use strict'
//REAFTORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const Database = use('Database')

class PedagogueController {

  async store({ request, response }) {

    const requiredFields = ["name", "password", "cpf", "email", "file_id"]

    for (let field of requiredFields) {
      if (!(field in request.body))
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

  async index({ request, response }) {

    const { id } = request.params
    const removeFields = ['password', "token_created_at", "created_at", "updated_at", "token"]

    const pedagogueInstance = await Pedagogue.find(id)

    const pedagogue = pedagogueInstance.toJSON()

    if (!pedagogue)
      return response.status(406).json({
        error: "Nenhum pedagogo com esse id foi identificado."
      })

    for (const field of removeFields)
      delete pedagogue[field]

    let path = ""

    try {
      if (!pedagogue.file_id)
        throw "O pedagogo não possui foto cadastrada.";
      const fileInstance = await File.findOrFail(pedagogue.file_id)
      path = fileInstance.path
    } catch (error) {
      path = "default.jpg"
    }

    return { ...pedagogue, path }

  }


}

module.exports = PedagogueController
