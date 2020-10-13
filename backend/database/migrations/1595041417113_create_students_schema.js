'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateStudentsSchema extends Schema {
  up () {
    this.create('students', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('enrollment', 254).notNullable().unique()
      table.integer('yearEntry')
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('age')
      table.string('liveWith', 254)
      table.string('originCity', 254),
      table.string('healthProblems', 254)
      table.string('nameFather', 254)
      table.string('professionFather', 254)
      table.string('contactFather', 254)
      table.string('nameMom', 254)
      table.string('professionMom', 254)
      table.string('contactMom', 254)
      table.string('lastSchool', 254)
      table.string('extraActivities', 254)
      table.string('preCefet', 254)
      table.string('highSchool', 254)
      table.timestamps()
    })
  }

  down () {
    this.drop('students')
  }
}

module.exports = CreateStudentsSchema
