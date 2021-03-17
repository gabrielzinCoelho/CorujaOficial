'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateSchoolYearSchema extends Schema {
  up () {
    this.create('school_years', (table) => {
      table.increments()
      table.integer('year').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('school_years')
  }
}

module.exports = CreateSchoolYearSchema
