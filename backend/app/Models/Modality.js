'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Modality extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'modalities'
  }

  courses () {
    return this.hasMany('App/Models/Course')
  }

}

module.exports = Modality
