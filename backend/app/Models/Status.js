'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Status extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'status'
  }

  historic () {
    return this.hasMany('App/Models/StudentHistoric')
  }

}

module.exports = Status
