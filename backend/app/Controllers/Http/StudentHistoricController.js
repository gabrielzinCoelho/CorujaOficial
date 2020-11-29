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

  //verificação objeto
  //desfazer alterações
  //salvar dados antes da atualização final
  // organizar por turmas?
  async newYear({ request, response }) {

    try {

      const { year, data } = request.body

      const statusInstances = await Status.all()

      const status = {}

      statusInstances.rows.forEach((statusElement, indexStatus) => {
        status[statusElement.$attributes.id] = statusElement
      })

      data.map(async (courseCarograph, indexCourse) => {

        const classesInstances = await Class.query().where({
          course_id: courseCarograph.course_id,
        }).fetch()

        const classes = {}

        classesInstances.rows.forEach((classElement, indexClass) => {
          classes[classElement.series] = classElement
        })

        for (const currentSeries of courseCarograph.currentClassStatus) {

          const studentHistoricInstances = {}, studentInstances = {}

          for (const student of currentSeries.students) {
            studentHistoricInstances[student.student_id] = await StudentHistoric.find(student.studentHistoric_id)
            studentInstances[student.student_id] = await Student.find(student.student_id)
          }

          for (const statusElement of currentSeries.statusStudents) {

            for (const student_id of statusElement.students_id) {

              // atualizando status do ano atual:
              //puxar a instancia -> editar status_id (cursando -> x), manter o year/statusYear
              studentHistoricInstances[student_id].status_id = statusElement.status_id
              await studentHistoricInstances[student_id].save()

              // se year == statusYear && aprovado-> year + 1/statusYear + 1, status_id: cursando (serie + 1)
              // se year == statusYear && não aprovado
              // -> year + 1/statusYear + 1, status_id: cursando (serie)
              // -> year + 1/statusYear, mantem status_id (serie + 1)

              if (classes[currentSeries.series + 1]) {
                //existe serie seguinte
                // nova instancia no ano sguinte
                const [statusNextSerie, statusYearNextSerie] = (statusElement.status_id == 5 ? [1, year + 1] : [statusElement.status_id, year])

                const studentHistoric = await StudentHistoric.create({
                  year: year + 1,
                  statusYear: statusYearNextSerie
                })

                await studentInstances[student_id].historic().save(studentHistoric)
                await classes[currentSeries.series + 1].historic().save(studentHistoric)
                await status[statusNextSerie].historic().save(studentHistoric)

              }

              if (statusElement.status_id == 2) {
                //reprovado -> nova instancia na mesma série no ano seguinte
                const studentHistoric = await StudentHistoric.create({
                  year: year + 1,
                  statusYear: year + 1
                })

                await studentInstances[student_id].historic().save(studentHistoric)
                await classes[currentSeries.series].historic().save(studentHistoric)
                await status[1].historic().save(studentHistoric)
              }
            }
          }

          // atualizando redundancias antigas:
          // se year != statusYear -> year + 1/statusYear, mantem status_id (serie + 1)

          if (classes[currentSeries.series + 1]) {

            const redundanceHistoricInstances = await Database
              .table('student_historics')
              .select(
                'student_historics.id as studentHistoric_id',
                'student_historics.statusYear',
                'student_historics.student_id',
                'student_historics.status_id'
              )
              .where({
                class_id: classes[currentSeries.series].$attributes.id,
                year
              })
              .whereBetween('statusYear', [0, year - 1])

            for (const redundanceHistoric of redundanceHistoricInstances) {

              await Database
                .table('student_historics')
                .insert({
                  class_id: classes[currentSeries.series + 1].$attributes.id,
                  status_id: redundanceHistoric.status_id,
                  student_id: redundanceHistoric.student_id,
                  year: year + 1,
                  statusYear: redundanceHistoric.statusYear
                })
            }
          }

        }
        // criando a turma de calouros
        const studentsNextClassInstances = await Student.createMany(courseCarograph.nextClassStudents)

        const studentsNextClass = {}

        studentsNextClassInstances.forEach((student, indexStudent) => {
          studentsNextClass[student.$attributes.id] = student
        })

        for (const student in studentsNextClass) {

          const studentHistoric = await StudentHistoric.create({
            year: year + 1,
            statusYear: year + 1
          })

          await studentsNextClass[student].historic().save(studentHistoric)
          await classes[1].historic().save(studentHistoric)
          await status[1].historic().save(studentHistoric)

        }


      })
      return response.status(200).json({ success: "O sistema foi atualizado com sucesso." })

    }
    catch (err) {
      return response.status(406).json({ error: "Houve problemas na atualização do sistema." })
    }
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
            'status.id as status_id',
            //'statusYear'
          )
          .innerJoin('classes', 'student_historics.class_id', 'classes.id')
          .innerJoin('students', 'student_historics.student_id', 'students.id')
          .innerJoin('status', 'student_historics.status_id', 'status.id')
          .where({
            course_id,
            series,
            year,
            statusYear: year
          })

        currentClassStatus.push({
          series,
          students: studentHistoric.map(element => {
            return {
              studentHistoric_id: element.studentHistoric_id,
              student_id: element.student_id,
              name: element.name,
              enrollment: element.enrollment,
              //statusYear: element.statusYear
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

            for (const element of studentHistoric) {
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
