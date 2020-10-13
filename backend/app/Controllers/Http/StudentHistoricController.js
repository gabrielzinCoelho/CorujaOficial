'use strict'
//REFATORAÇÃO ()
const StudentHistoric = use('App/Models/StudentHistoric')
const Course = use('App/Models/Course')
const Class = use('App/Models/Class')
const Status = use('App/Models/Status')
const Student = use('App/Models/Student')
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
        'students.yearEntry',
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

    if (studentHistoric.length == 0)
      return response.status(406).json({ error: "Nenhuma turma foi encontrada." })

    const studentHistoricResponse = {
      class_id: studentHistoric[0].class_id,
      students: studentHistoric.map(element => {
        return {
          studentHistoric_id: element.studentHistoric_id,
          student_id: element.student_id,
          name: element.name,
          enrollment: element.enrollment,
          yearEntry: element.yearEntry,
          status: element.status,
          year: element.year,
          statusYear: element.statusYear
        }
      })
    }

    return studentHistoricResponse
  }

  async seedCarograph({ request, response }) {

    const { data } = request.body

    const statusInstances = await Status.all()

    const status = {}

    statusInstances.rows.forEach((statusElement, indexStatus) => {
      status[statusElement.$attributes.id] = statusElement
    })

    data.map(async (courseCarograph, indexCourse) => {

      const studentsInstances = await Student.createMany(courseCarograph.students)

      const students = {}

      studentsInstances.forEach((student, indexStudent) => {
        students[student.$attributes.enrollment] = student
      })

      const classesInstances = await Class.query().where({
        course_id: courseCarograph.course_id,
      }).fetch()

      const classes = {}

      classesInstances.rows.forEach((classElement, indexClass) => {
        classes[classElement.series] = classElement
      })

      courseCarograph.years.forEach((yearElement, indexYear) => {
        yearElement.series.forEach((seriesElement, indexSeries) => {
          seriesElement.statusStudents.forEach((statusStudentsElement, indexStatusStudents) => {
            statusStudentsElement.status.forEach((statusElement, indexStatus) => {
              statusElement.enrollments.forEach(async (enrollment, indexEnrollment) => {

                const { statusYear } = statusStudentsElement

                const studentHistoric = await StudentHistoric.create({
                  year: statusYear,
                  statusYear
                })

                await students[enrollment].historic().save(studentHistoric)
                await classes[seriesElement.series + (statusStudentsElement.statusYear - yearElement.year)].historic().save(studentHistoric)
                await status[statusElement.status_id].historic().save(studentHistoric)

                if (statusElement.status_id != 5) {
                  //não foi aprovado
                  seriesElement.statusStudents.forEach(async (statusStudentsElement2, indexStatusStudents2) => {
                    if (statusStudentsElement2.statusYear > statusYear) {
                      //redundância alunos que não foram aprovados, mas continuam na turma permanentemente
                      const studentHistoric2 = await StudentHistoric.create({
                        year: statusStudentsElement2.statusYear,
                        statusYear
                      })

                      await students[enrollment].historic().save(studentHistoric2)
                      await classes[seriesElement.series + (statusStudentsElement2.statusYear - yearElement.year)].historic().save(studentHistoric2)
                      await status[statusElement.status_id].historic().save(studentHistoric2)

                    }
                  })

                }


              })
            })
          })
        })
      })


    })

    return response.status(200).json({ success: "O sistema está pronto para uso." })

  }

  async seedCarographObject({ request, response }) {

    const coursesCarograph = []
    const yearStart = Number(request.params.yearStart)
    const yearEnd = Number(request.params.yearEnd)
    const coursesInstances = await Course.all()
    const statusInstances = await Status.all()
    const status = []

    statusInstances.rows.map(statusInstance => {
      let statusObject = {
        status_id: statusInstance.$attributes.id,
        enrollments: []
      }

      status.push(statusObject)

    })

    coursesInstances.rows.map(async course => {

      const years = []

      const { duration, id: course_id } = course.$attributes

      for (let i = yearStart; i <= yearEnd; i++) {

        const series = []

        let limitLoopSeries = (i == yearStart) ? duration : 1

        for (let j = 1; j <= limitLoopSeries; j++) {

          const statusStudents = []

          let limitLoopStatus = (i + duration - j) > yearEnd ? yearEnd : (i + duration - j)

          for (let k = i; k <= limitLoopStatus; k++) {

            statusStudents.push({
              statusYear: k,
              status
            })

          }

          series.push({
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
        students: [],
        years
      })


    })

    return { data: coursesCarograph }

  }

  async newYear({ request, response }) {

  }

  async newYearObject({ request, response }) {
    // redundância de alunos =
    //  - não aparecem?
    //  - aparecem identificados = já dentro do respectivo status? atributo identificando? (depende frontend)

    const coursesCarograph = []
    const coursesInstances = await Course.all()
    const statusInstances = await Status.all()

    const yearDB = (await Database.table('student_historics').max('year as year'))[0].year
    const year = yearDB ? yearDB : Number(new Date().getFullYear())

    const promises = coursesInstances.rows.map(async course => {

      const { duration, id: course_id } = course.$attributes

      const currentClassStatus = []

      for (const [index, series] of (duration => {
        const range = []
        for (let j = 1; j <= duration; j++)
          range.push(j)
        return range;
      })(duration).entries()) {

        const studentHistoric = await Database
          .table('student_historics')
          .select(
            'student_historics.id as studentHistoric_id',
            'students.id as student_id',
            'students.name',
            'students.enrollment',
            'status.id as status_id'
          )
          .innerJoin('classes', 'student_historics.class_id', 'classes.id')
          .innerJoin('students', 'student_historics.student_id', 'students.id')
          .innerJoin('status', 'student_historics.status_id', 'status.id')
          .where({
            course_id,
            series,
            year,
          })

        currentClassStatus.push({
          series,
          students: studentHistoric.map(element => {
            return {
              studentHistoric_id: element.studentHistoric_id,
              student_id: element.student_id,
              name: element.name,
              enrollment: element.enrollment,
            }
          }),
          statusStudents: (() => {

            const statusStudents = []

            statusInstances.rows.map(statusInstance => {
              let statusObject = {
                status_id: statusInstance.$attributes.id,
                students_id: []
              }

              statusStudents.push(statusObject)

            })

            for(const element of studentHistoric){
              statusStudents.map((statusElement, index) => {
                if (element.status_id == statusElement.status_id)
                  statusStudents[index].students_id.push(element.student_id)
              })
            }
            return statusStudents

          })()
        })

      }

      coursesCarograph.push({
        course_id,
        currentClassStatus,
        nextClassStudents: []
      })

    })

    await Promise.all(promises)

    return { year, data: coursesCarograph }

  }

}
module.exports = StudentHistoricController
