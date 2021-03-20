'use strict'
//REFATORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const File = use('App/Models/File')
const Database = use('Database')

class SessionController {

  async store({ request, response, auth }) {

    const { cpf, password } = request.body
    const removeFields = ['password', "token_created_at", "created_at", "updated_at", "email", "file_id",
      "telephone", "age", "address", "address_complement"
    ]

    // já faz tratamento de erro - ausência de cpf e/ou senha
    const { token } = await auth.attempt(cpf, password)

    const pedagogueInstance = await Pedagogue.query().where({
      cpf
    }).fetch()

    const pedagogoData = pedagogueInstance.rows[0].toJSON()
    
    let path = ""

    try {
      if (!pedagogoData.file_id)
        throw "O pedagogo não possui foto cadastrada.";
      const fileInstance = await File.findOrFail(pedagogoData.file_id)
      path = fileInstance.path
    } catch (error) {
      path = "default.jpg"
    }

    for (const field of removeFields)
      delete pedagogoData[field]

    return { ...pedagogoData, path, token }

  }

  async index({ request, response }) {
    return response.status(200).send({ authenticated: true })
  }

}

module.exports = SessionController
