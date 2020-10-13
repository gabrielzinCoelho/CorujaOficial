'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'courses'
  }

  classes () {
    return this.hasMany('App/Models/Class')
  }
  modality () {
    return this.belongsTo('App/Models/Modality')
  }

}

module.exports = Course
