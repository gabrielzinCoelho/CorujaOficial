'use strict'
//REFATORAÇÃO ()
const StudentHistoric = use('App/Models/StudentHistoric')
const Course = use('App/Models/Course')
const Class = use('App/Models/Class')
const Status = use('App/Models/Status')
const Student = use('App/Models/Student')
const File = use('App/Models/File')
const Database = use('Database')

class StudentHistoricController {

  async show({ request, response, auth }) {

    const { course_id, series, year } = request.params;

    const studentHistoric = await Database
      .table('student_historics')
      .select(
        'student_historics.id as studentHistoric_id',
        'classes.id as class_id',
        'students.id as student_id',
        'students.name',
        'students.enrollment',
        'students.file_id',
        //'students.yearEntry',
        'status.id as status_id',
        'status.name as status',
        'student_historics.year',
        'student_historics.statusYear'
      )
      .innerJoin('classes', 'student_historics.class_id', 'classes.id')
      .innerJoin('students', 'student_historics.student_id', 'students.id')
      .innerJoin('status', 'student_historics.status_id', 'status.id')
      .where({
        course_id,
        series,
        year
      })
      .groupBy('students.name')

    if (studentHistoric.length == 0)
      return response.status(406).json({ error: "Nenhuma turma foi encontrada." })

    const studentHistoricResponse = {
      class_id: studentHistoric[0].class_id,
      students: await Promise.all(studentHistoric.map(async element => {

        let path = ""

        try{
          if(!element.file_id)
            throw "O estudante não possui foto cadastrada.";
          const fileInstance = await File.findOrFail(element.file_id)
          path = fileInstance.path
        }catch(error){
          path = "default.jpg"
        }

        return {
          studentHistoric_id: element.studentHistoric_id,
          student_id: element.student_id,
          name: element.name,
          enrollment: element.enrollment,
          path,
          yearEntry: element.yearEntry,
          status_id: element.status_id,
          status: element.status,
          year: element.year,
          statusYear: element.statusYear
        }
      }))
    }

    return studentHistoricResponse
  }

}
module.exports = StudentHistoricController
