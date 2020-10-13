'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Student extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'students'
  }

  historic () {
    return this.hasMany('App/Models/StudentHistoric')
  }

  file() {
    return this.belongsTo('App/Models/File')
  }

}

module.exports = Student
