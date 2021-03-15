'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateClassesSchema extends Schema {
  up () {
    this.create('classes', (table) => {
      table.increments()
      table
        .integer('course_id')
        .unsigned()
        .references('id')
        .inTable('courses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('series').notNullable()
      table.integer('lastClassYear').notNullable()
      table.integer('firstClassYear').notNullable()
      table.boolean('newYear').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('classes')
  }
}

module.exports = CreateClassesSchema
