'use strict'
//REAFTORAÇÃO (OK)
const Pedagogue = use('App/Models/Pedagogue')
const Database = use('Database')
const Mail = use('Mail')
const Hash = use('Hash')

const moment = require('moment')

const crypto = require('crypto')

class ForgotPasswordController {

  async store({request, response}){

    try{

      const {email, redirect} = request.body

      const pedagogue = await Pedagogue.findByOrFail('email', email)

      pedagogue.token = crypto.randomBytes(16).toString('hex')
      pedagogue.token_created_at = new Date()

      await pedagogue.save()

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        {
          email,
          token: pedagogue.token,
          redirect: `${redirect}/${pedagogue.token}`
        },
        message => {
          message
            .to(pedagogue.email)
            .from('yuri.farnesio@gmail.com' , 'test')
            .subject('Redefinação de Senha')
        }
      )


    }catch(error) {

      return response.status(error.status).send({
        error: "Algo deu errado, tente novamente"
      })

    }


  }

  async update({request, response}) {

    try {

      const {password, token} = request.body

      const pedagogue = await Pedagogue.findByOrFail({token})

      const tokenExpired = moment()
        .subtract('1', 'days')
        .isAfter(pedagogue.token_created_at)

      if(tokenExpired)
        return response.status(401).send({
          error: "O token necessário para redefinição de senha está expirado"
        })

      pedagogue.token = null
      pedagogue.token_created_at = null
      pedagogue.password = await Hash.make(password)

      await pedagogue.save()

    }catch(error) {

      return response.status(error.status).send({
        error: "Algo deu errado na redefinição da senha."
      })

    }




  }


}

module.exports = ForgotPasswordController
