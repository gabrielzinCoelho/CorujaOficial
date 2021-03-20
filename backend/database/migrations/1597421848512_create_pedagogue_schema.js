'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PedagogueSchema extends Schema {
  up () {
    this.create('pedagogues', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 254).notNullable()
      table.string('cpf', 254).notNullable()
      table.string('address', 254).notNullable()
      table.string('address_complement', 254).notNullable()
      table.string('telephone', 15).notNullable()
      table.integer('age')
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
      table.string('token', 254).unique()
      table.datetime('token_created_at', { precision: 6 })
      table.timestamps()
    })
    //telefone, endereço, idade,
  }

  down () {
    this.drop('pedagogues')
  }
}

module.exports = PedagogueSchema
