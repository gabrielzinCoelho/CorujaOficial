'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateModalitiesSchema extends Schema {
  up () {
    this.create('modalities', (table) => {
      table.increments()
      table.string('name', 254).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('modalities')
  }
}

module.exports = CreateModalitiesSchema
