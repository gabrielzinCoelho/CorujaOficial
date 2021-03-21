'use strict'
//REAFTORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const File = use('App/Models/File')
const Hash = use('Hash')
const Database = use('Database')

class PedagogueController {

  async store({ request, response }) {

    const requiredFields = ["name", "password", "cpf", "email", "file_id"]
    const createFields = ["name", "email", "password", "file_id", "age", "cpf", "city", "district",
    "address", "address_number", "address_complement", "contact"]


    for (let field of requiredFields) {
      if (!(field in request.body))
        return response.status(406).json({
          error: `Campo '${field}' é obrigatório para este processo.`
        })
    }

    const pedagogue = new Pedagogue()

    for(let field of createFields){

      if(request.body[field])
        pedagogue[field] = request.body[field]

    }

    await pedagogue.save()

    return response.status(200).json(pedagogue)

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

    console.log(pedagogue.file_id)

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

  async update({ request, response }) {

    const updateFields = ["name", "email", "password", "file_id", "age", "cpf", "city", "district",
      "address", "address_number", "address_complement", "contact"]

    let checkFields = false

    for (let field of updateFields) {
      if (field in request.body) {

        if(field == "password")
          request.body.password = await Hash.make(request.body.password)

        checkFields = true

      }
    }

    if (!checkFields)
      return response.status(406).json({
        error: `Ao menos um dos campos do pedagogo deve ser atualizado.`
      })

    const { id } = request.params

    const pedagogueInstance = await Pedagogue.find(id)

    for(let field of updateFields){

      if(request.body[field])
        pedagogueInstance[field] = request.body[field]

    }

    pedagogueInstance.save()

    return response.status(200).json({
      message: "Os dados do pedagogo foram atualizados com sucesso.",
    })


  }


}

module.exports = PedagogueController
