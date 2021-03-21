'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Pedagogue extends Model {

  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (pedagogueInstance) => {
      pedagogueInstance.password = await Hash.make(pedagogueInstance.password)
    })

  }

  static get table () {
    return 'pedagogues'
  }



}

module.exports = Pedagogue
