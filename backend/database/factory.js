'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')

const { resolve } = require('path')
const Math = require('mathjs');

/* const turmasPayload = require(resolve(__dirname, 'factoryDatas', 'classesData.js')) */
const statusPayload = use(resolve(__dirname, 'factoryDatas', 'statusData.js'))
const coursePayload = use(resolve(__dirname, 'factoryDatas', 'coursesData.js'))
const modalityPayload = use(resolve(__dirname, 'factoryDatas', 'modalitiesData.js'))

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

Factory.blueprint('App/Models/Student', (faker, i, data = {}) => {
  return {
    name: faker.name({ middle: true }),
    enrollment: faker.string({ length: 26, casing: 'upper', alpha: true, numeric: true }),
    yearEntry: faker.integer({min: 2008, max: 2020}),
    ...data
  }
})

Factory.blueprint('App/Models/Status', (faker, i, data = {}) => {
  return {
    name: statusPayload[getRndInteger(0, statusPayload.length - 1)],
    ...data
  }
})

Factory.blueprint('App/Models/Course', (faker, i, data = {}) => {
 return {
    name: coursePayload[getRndInteger(0, coursePayload.length - 1)],
    ...data
  }
})

Factory.blueprint('App/Models/Modality', (faker, i, data = {}) => {
 return {
    name: modalityPayload[getRndInteger(0, modalityPayload.length - 1)],
    ...data
  }
})

Factory.blueprint('App/Models/Class', (faker, i, data = {}) => {
  return {
    series: faker.integer({ min: 1, max: 6 }),
    ...data
  }
})

Factory.blueprint('App/Models/StudentHistoric', (faker, i, data = {}) => {
  return {
    year: faker.integer({min: 2008, max: 2020}),
    ...data
  }
})

//  year: faker.date({ year: faker.integer({min: 2008, max: 2020}) })
