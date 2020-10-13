'use strict'
//REFATORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const Database = use('Database')

class SessionController {

  async store({request, response, auth}){

    const {cpf, password} = request.body

    // já faz tratamento de erro - ausência de cpf e/ou senha
    const {token} = await auth.attempt(cpf, password)

   return {token}

  }

  async index({request, response}) {
    return response.status(200).send({ authenticated: true})
  }

}

module.exports = SessionController
