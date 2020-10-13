'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateStudentHistoricSchema extends Schema {
  up () {
    this.create('student_historics', (table) => {
      table.increments()
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('class_id')
        .unsigned()
        .references('id')
        .inTable('classes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('status_id')
        .unsigned()
        .references('id')
        .inTable('status')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('year').notNullable()
      table.integer('statusYear').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('student_historics')
  }
}

module.exports = CreateStudentHistoricSchema
