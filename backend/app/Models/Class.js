'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Class extends Model {

  static boot () {
    super.boot()
  }

  static get table () {
    return 'classes'
  }

   course () {
    return this.belongsTo('App/Models/Course')
  }

  historic () {
    return this.hasMany('App/Models/StudentHistoric')
  }

}

module.exports = Class
