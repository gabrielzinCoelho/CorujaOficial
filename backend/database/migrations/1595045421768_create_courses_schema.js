'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateCoursesSchema extends Schema {
  up () {
    this.create('courses', (table) => {
      table.increments()
      table.string('name', 254).notNullable().unique()
      table
        .integer('modality_id')
        .unsigned()
        .references('id')
        .inTable('modalities')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('duration').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CreateCoursesSchema
