'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StudentHistoric extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'student_historics'
  }

  status () {
    return this.belongsTo('App/Models/Status')
  }

  class () {
    return this.belongsTo('App/Models/Class')
  }

  student () {
    return this.belongsTo('App/Models/Student')
  }

}

module.exports = StudentHistoric
