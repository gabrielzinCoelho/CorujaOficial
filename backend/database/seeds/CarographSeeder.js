'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Course = use('App/Models/Course')
const Class = use('App/Models/Class')
const Database = use('Database')
const { resolve } = require('path')

//busca os status e as classes salvas nos objetos do diretório factoryDatas
const statusPayload = use(resolve(__dirname, '../', 'factoryDatas', 'statusData.js'))
const classPayload = use(resolve(__dirname, '../', 'factoryDatas', 'classesData.js'))

class CarographSeeder {
  async run() {

    const schoolYearInit = 2018, schoolYearEnd = 2024

    const status = [], modality = [], courses = [], classes = []
    var previousIndexCourse = 0, previousIndexClass = 0
    //salva um array de instâncias de status criados pela factory
    for (let i = 0; i < statusPayload.length; i++) {
      status[i] = await Factory.model('App/Models/Status').create({ name: statusPayload[i] })
    }
    //salva um array de instâncias de classes criados pela factory (modalidade -> curso -> classes)
    for (let i = 0; i < classPayload.length; i++) {

      modality[i] = await Factory.model('App/Models/Modality').create({ name: classPayload[i].modality })
      //salva um array de instâncias de cursos criados pela factory (modalidade -> cursos)
      for (let j = 0; j < classPayload[i].courses.length; j++) {

        const courseInstance = await Factory.model('App/Models/Course').make({
          name: classPayload[i].courses[j].name,
          duration: classPayload[i].courses[j].duration,
          newYear: false
        })
        await modality[i].courses().save(courseInstance)
        courses[previousIndexCourse] = await Course.find(courseInstance.$attributes.id)
        //cria uma classe para cada série do curso
        for (let k = 0; k < classPayload[i].courses[j].duration; k++) {
          const classInstance = await Factory.model('App/Models/Class').make({
            series: k + 1,
            firstClassYear: schoolYearInit,
            lastClassYear: schoolYearEnd,
            newYear: false
          })
          await courses[previousIndexCourse].classes().save(classInstance)
          classes[previousIndexClass] = await Class.find(classInstance.$attributes.id)

          previousIndexClass += 1
        }
        previousIndexCourse += 1
      }

    }


  }

}

module.exports = CarographSeeder
