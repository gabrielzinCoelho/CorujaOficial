'use strict'

/*
|--------------------------------------------------------------------------
| GenerateObjectCarographSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Math = require('mathjs');
const fs = require('fs')

const Factory = use('Factory')
const Course = use('App/Models/Course')
const Status = use('App/Models/Status')

const fileName = "CarographSeederOutput"
const path = "./database/seeds/JSONSeedersFiles/"

class GenerateObjectCarographSeeder {
  async run() {

    const yearStart = 2018 //2018-2024 (min: 30, max: 30)
    const yearEnd = 2024
    const maxStudentsPerClass = 20
    const minStudentsPerClass = 20

    const coursesInstances = await Course.all()
    const statusInstances = await Status.all()

    const coursesCarograph = [], statusArray = []


    coursesInstances.rows.map(async course => {

      const students = [], years = []

      const { duration, id: course_id } = course.$attributes

      for (let i = yearStart; i <= yearEnd; i++) {

        const series = []

        let limitLoopSeries = (i == yearStart) ? duration : 1

        for (let j = limitLoopSeries; j >= 1; j--) {

          const statusStudents = []

          let limitLoopStatus = (i + duration - j) > yearEnd ? yearEnd : (i + duration - j)

          for (let k = i; k <= limitLoopStatus; k++) {

            const status = []
            statusInstances.rows.map(statusInstance => {

              status.push({
                status_id: statusInstance.$attributes.id,
                enrollments: []
              })

            })

            let enrollmentArray = []

            if (k == i) {

              const studentsInstances = await Factory
                .model('App/Models/Student')
                .makeMany(this.getRndInteger(minStudentsPerClass, maxStudentsPerClass), { yearEntry: k })

              studentsInstances.map(studentElement => {

                students.push({
                  name: studentElement.$attributes.name,
                  enrollment: studentElement.$attributes.enrollment,
                  yearEntry: studentElement.$attributes.yearEntry
                })

                enrollmentArray.push(studentElement.$attributes.enrollment)

              })
            }

            else {
              statusStudents.map(
                (statusStudentsElement, indexStatusStudents) => {
                  if (statusStudentsElement.statusYear == (k - 1)) {
                    statusStudentsElement.status.map(
                      (statusElement, indexStatus) => {
                        if (statusElement.status_id == 5) {
                          enrollmentArray = statusElement.enrollments
                        }
                      }
                    )
                  }
                }
              )

            }

            if (i != yearStart) {
              years.map(
                (yearsElement, indexYear) => {
                  if (yearsElement.year == (i - 1)) {
                    yearsElement.series.map(
                      (seriesElement, indexSeries) => {
                        if (seriesElement.series == j) {
                          seriesElement.statusStudents.map(
                            (statusStudentsElement, indexStatusStudents) => {
                              if (statusStudentsElement.statusYear == (k - 1)) {
                                statusStudentsElement.status.map(
                                  (statusElement, indexStatus) => {
                                    if (statusElement.status_id == 2) {
                                      enrollmentArray = enrollmentArray.concat(statusElement.enrollments)
                                    }
                                  }
                                )
                              }
                            }
                          )
                        }
                      })
                  }
                })
            }
            else if (k != yearStart) {
              series.map(
                (seriesElement, indexSeries) => {
                  if (seriesElement.series == (j + 1)) {
                    seriesElement.statusStudents.map(
                      (statusStudentsElement, indexStatusStudents) => {
                        if (statusStudentsElement.statusYear == (k - 1)) {
                          statusStudentsElement.status.map(
                            (statusElement, indexStatus) => {
                              if (statusElement.status_id == 2) {
                                enrollmentArray = enrollmentArray.concat(statusElement.enrollments)
                              }
                            }
                          )
                        }
                      }
                    )
                  }
                })
            }

            enrollmentArray.map(enrollment => {

              let statusIdGenerated = this.getRndInteger(2, 5)
              status.map((statusElement, index) => {
                if (statusIdGenerated == statusElement.status_id)
                  status[index].enrollments.push(enrollment)
              })

            })

            statusStudents.push({
              statusYear: k,
              status
            })

          }

          series.unshift({
            series: j,
            statusStudents
          })

        }

        years.push({
          year: i,
          series
        })

      }
      coursesCarograph.push({
        course_id,
        students,
        years
      })

      if(coursesCarograph[coursesInstances.rows.length - 1]){
        const jsonString = JSON.stringify({
          data: coursesCarograph
        })

        fs.writeFile(`${path}${fileName}.json`, jsonString, err => {
          if (err) {
            console.log('Erro ao gravar arquivo', err)
          } else {
            console.log('arquivo gravado com êxito')
          }
        })
      }

    })

    return coursesCarograph

  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRndIntegerWithProbabilities(numbers) {

    const min = 0, max = 99
    let lastValueProbabilitie = 0, defaultNumberGenerate = 0, numberGenerate = 0

    const probabilities = []

    defaultNumberGenerate = this.getRndInteger(min, max)

    numbers.map((number, index) => {
      probabilities[index] = lastValueProbabilitie + number - 1
      lastValueProbabilitie += number - 1

      if (defaultNumberGenerate <= probabilities[index]) {
        numberGenerate = index
        //break;
      }

    })

    return numberGenerate

  }

}

module.exports = new GenerateObjectCarographSeeder()
