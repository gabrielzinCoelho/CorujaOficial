'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateFilesSchema extends Schema {
  up () {
    this.create('files', (table) => {
      table.increments()
      table.string('path', 254).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('files')
  }
}

module.exports = CreateFilesSchema
