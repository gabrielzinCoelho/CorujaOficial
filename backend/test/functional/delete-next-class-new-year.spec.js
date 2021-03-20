'use strict'

const { test, trait } = use('Test/Suite')('Delete Next Class New Year')

const base_url = "http://localhost:3333"
const course_id = 1

const Database = use('Database')
const Factory = use('Factory')

trait('Test/ApiClient')

test(`verificar se os registros de studentHistoric antes e depois de uma virada de ano dos calouros
        seguida de uma deleção são os mesmos`, async ({ assert, client }) => {

  const students = []

  const studentsInstances = await Factory
    .model('App/Models/Student')
    .makeMany(30)

  studentsInstances.map(studentElement => {

    students.push({
      name: studentElement.$attributes.name,
      enrollment: studentElement.$attributes.enrollment,
      yearEntry: studentElement.$attributes.yearEntry
    })


  })

  const studentHistoricBefore = await Database
    .table('student_historics')
    .select(
      'id',
      'student_id',
      'class_id',
      'status_id',
      'year',
      'statusYear'
    )

  await (()=>{
    return new Promise(async (resolve, reject) => {

      await client.post(`${base_url}/newYear/nextClass`).send({
        course_id,
        students
      }).end()

      resolve()

    })
  })()

  await (()=>{
    return new Promise(async (resolve, reject) => {

      await client.delete(`${base_url}/newYear/course/${course_id}`).end()

      resolve()

    })
  })()

  const studentHistoricAfter = await Database
    .table('student_historics')
    .select(
      'id',
      'student_id',
      'class_id',
      'status_id',
      'year',
      'statusYear'
    )

  assert.equal(studentHistoricBefore, studentHistoricAfter)

}).timeout(0)
