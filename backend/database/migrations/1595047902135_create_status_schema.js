'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateStatusSchema extends Schema {
  up () {
    this.create('status', (table) => {
      table.increments()
      table.string('name', 254).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('status')
  }
}

module.exports = CreateStatusSchema
