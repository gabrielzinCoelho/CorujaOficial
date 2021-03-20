'use strict'

const { test, trait } = use('Test/Suite')('Delete New Year Test')

const base_url = "http://localhost:3333"
const class_id = 1

const Database = use('Database')

trait('Test/ApiClient')

test(`verificar se os registros de studentHistoric antes e depois de uma virada de ano
        seguida de uma deleção são os mesmos`, async ({ assert, client }) => {

  const response = await client.get(`${base_url}/newYear/class/${class_id}`).end()

  const { body: responseData } = response

  if (responseData.statusStudents[0].students_id.length) {


    for (const student_id of responseData.statusStudents[0].students_id) {

      responseData.statusStudents[Math.floor(Math.random() * 4) + 1].students_id.push(student_id)

    }

    responseData.statusStudents[0].students_id = Array(0)

  }

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

  await client.post(`${base_url}/newYear`).send(responseData).end()

  await client.delete(`${base_url}/newYear/class/${class_id}`).end()

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
