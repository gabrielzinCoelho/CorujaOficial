'use strict'

/*
|--------------------------------------------------------------------------
| GenerateObjectNewYearSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const fs = require('fs')

const fileNameInput = "NewYearInput"
const fileNameOutput = "NewYearOutput"
const path = "./database/seeds/JSONSeedersFiles/"

const numStudentsNextClass = 30

class GenerateObjectNewYearSeeder {
  async run() {

    fs.readFile(`${path}${fileNameInput}.json`, 'utf8', async (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log(`${fileNameInput}.json lido com sucesso.\nProcessando a entrada...`);
      const dataObject = JSON.parse(data)

      for (const course of dataObject.data) {

        const studentsInstances = await Factory
          .model('App/Models/Student')
          .makeMany(numStudentsNextClass, { yearEntry: dataObject.year + 1 })

        studentsInstances.map(studentElement => {

          course.nextClassStudents.push({
            name: studentElement.$attributes.name,
            enrollment: studentElement.$attributes.enrollment,
            yearEntry: studentElement.$attributes.yearEntry
          })

        })

        for(const currentSerie of course.currentClassStatus){


          for(const student_id of currentSerie.statusStudents[0].students_id)
            currentSerie.statusStudents[Math.floor(Math.random() * (4)) + 1].students_id.push(student_id)

          currentSerie.statusStudents[0].students_id = []

        }

      }

      const jsonString = JSON.stringify(dataObject)

      fs.writeFile(`${path}${fileNameOutput}.json`, jsonString, err => {
        if (err) {
          console.log('Erro ao gravar arquivo', err)
        } else {
          console.log('Arquivo gravado com êxito')
        }
      })
    })



}
}

module.exports = GenerateObjectNewYearSeeder
