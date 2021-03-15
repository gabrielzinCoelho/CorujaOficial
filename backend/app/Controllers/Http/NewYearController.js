'use strict'

const StudentHistoric = use('App/Models/StudentHistoric')
const Course = use('App/Models/Course')
const Class = use('App/Models/Class')
const Status = use('App/Models/Status')
const Student = use('App/Models/Student')
const File = use('App/Models/File')
const Database = use('Database')

/*

  {
    class_id: 1,
    students: [],
    statusStudents:[{
      status_id: 2,
      students_id: []
    }]
  }

*/

class NewYearController {

  async new({ request, response }) {

    const statusInstances = await Status.all()

    /*const yearDB = (await Database.table('student_historics').max('year as year'))[0].year
    const year = yearDB ? yearDB : Number(new Date().getFullYear())*/

    const schoolYear = 2024
    const { class_id } = request.params

    const studentHistoric = await Database
      .table('student_historics')
      .select(
        'student_historics.id as studentHistoric_id',
        'students.id as student_id',
        'students.name',
        'students.enrollment',
        'status.id as status_id',
        'students.file_id'
        // path,
      )
      .innerJoin('classes', 'student_historics.class_id', 'classes.id')
      .innerJoin('students', 'student_historics.student_id', 'students.id')
      .innerJoin('status', 'student_historics.status_id', 'status.id')
      .where({
        class_id,
        year: schoolYear,
        statusYear: schoolYear
      })

    return {
      year: schoolYear,
      class_id,
      students: await Promise.all(studentHistoric.map(async element => {

        let path = ""

        try {
          if (!element.file_id)
            throw "O estudante não possui foto cadastrada.";
          const fileInstance = await File.findOrFail(element.file_id)
          path = fileInstance.path
        } catch (error) {
          path = "default.jpg"
        }

        return {
          studentHistoric_id: element.studentHistoric_id,
          student_id: element.student_id,
          name: element.name,
          enrollment: element.enrollment,
          path,
        }
      })),
      statusStudents: (() => {

        const statusStudents = []

        statusInstances.rows.map(statusInstance => {
          let statusObject = {
            status: statusInstance.$attributes.name,
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
    }

  }

  async store({ request, response }) {

    try {

      const { year, class_id, students, statusStudents } = request.body

      const statusInstances = await Status.all()
      const status = {}

      //puxa as instâncias de status
      statusInstances.rows.forEach((statusElement, indexStatus) => {
        status[statusElement.$attributes.id] = statusElement
      })

      const classInstance = await Class.findOrFail(class_id)
      const courseInstance = await Course.find(classInstance.course_id)

      const lastSerie = (courseInstance.$attributes.duration == classInstance.series ? true : false)
      let nextClassInstance = {}
      if (!lastSerie) {

        const nextClassSearch = await Class.query().where({
          series: classInstance.series + 1,
          course_id: classInstance.course_id
        }).fetch()

        nextClassInstance = nextClassSearch.rows[0]

      }

      var hasReprove = false
      const studentHistoricInstances = {}, studentInstances = {}

      for (const student of students) {
        studentHistoricInstances[student.student_id] = await StudentHistoric.find(student.studentHistoric_id)
        studentInstances[student.student_id] = await Student.find(student.student_id)
      }

      for (const statusElement of statusStudents) {

        for (const student_id of statusElement.students_id) {

          // atualizando status do ano atual:
          //puxar a instancia -> editar status_id (cursando -> x), manter o year/statusYear
          studentHistoricInstances[student_id].status_id = statusElement.status_id
          await studentHistoricInstances[student_id].save()

          // se year == statusYear && aprovado-> year + 1/statusYear + 1, status_id: cursando (serie + 1)
          // se year == statusYear && não aprovado
          // -> year + 1/statusYear + 1, status_id: cursando (serie)
          // -> year + 1/statusYear, mantem status_id (serie + 1)

          if (!lastSerie) {
            //existe serie seguinte
            // nova instancia no ano sguinte
            const [statusNextSerie, statusYearNextSerie] = (statusElement.status_id == 5 ? [1, year + 1] : [statusElement.status_id, year])

            const studentHistoric = await StudentHistoric.create({
              year: year + 1,
              statusYear: statusYearNextSerie
            })

            //console.log(nextClassInstance)

            await studentInstances[student_id].historic().save(studentHistoric)
            await nextClassInstance.historic().save(studentHistoric) //next classInstance currentSeries.series + 1
            await status[statusNextSerie].historic().save(studentHistoric)

          }

          if (statusElement.status_id == 2) {
            //reprovado -> nova instancia na mesma série no ano seguinte
            const studentHistoric = await StudentHistoric.create({
              year: year + 1,
              statusYear: year + 1
            })

            await studentInstances[student_id].historic().save(studentHistoric)
            await classInstance.historic().save(studentHistoric)
            await status[1].historic().save(studentHistoric)

            hasReprove = true
          }
        }
      }

      // atualizando redundancias antigas:
      // se year != statusYear -> year + 1/statusYear, mantem status_id (serie + 1)

      if (!lastSerie) {

        const redundanceHistoricInstances = await Database
          .table('student_historics')
          .select(
            'student_historics.id as studentHistoric_id',
            'student_historics.statusYear',
            'student_historics.student_id',
            'student_historics.status_id'
          )
          .where({
            class_id,
            year
          })
          .whereBetween('statusYear', [0, year - 1])

        for (const redundanceHistoric of redundanceHistoricInstances) {

          await Database
            .table('student_historics')
            .insert({
              class_id: nextClassInstance.$attributes.id, // currentSeries.series + 1
              status_id: redundanceHistoric.status_id,
              student_id: redundanceHistoric.student_id,
              year: year + 1,
              statusYear: redundanceHistoric.statusYear
            })
        }
      }

      if (!lastSerie) {
        nextClassInstance.lastClassYear = year + 1
        nextClassInstance.save()
      }

      if (hasReprove) {
        classInstance.lastClassYear = year + 1
      }

      classInstance.newYear = true
      classInstance.save()

      return response.status(200).json({ success: "O sistema foi atualizado com sucesso." })

    }
    catch (err) {
      return response.status(406).json({ error: `Houve problemas na atualização do sistema.\n${err}` })
    }
  }

  async nextClass({ request, response }) {

    // criando a turma de calouros

    const {course_id, year, students} = request.body

    const courseInstance = await Course.find(course_id)

    const classSearch = await Class.query().where({
      series: 1,
      course_id
    }).fetch()

    const classInstance = classSearch.rows[0]

    const statusInstances = await Status.all()
    const status = {}

    //puxa as instâncias de status
    statusInstances.rows.forEach((statusElement, indexStatus) => {
      status[statusElement.$attributes.id] = statusElement
    })

    const studentsNextClassInstances = await Student.createMany(students)

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
      await classInstance.historic().save(studentHistoric)
      await status[1].historic().save(studentHistoric)

    }


    classInstance.lastClassYear = year + 1
    classInstance.save()

    courseInstance.newYear = true
    courseInstance.save()

    return response.status(200).json({ success: "O sistema foi atualizado com sucesso." })
  }

  async destroy({ request, response }) {
    return { success: true }
  }

  async newYearStatus({ request, response }) {

    let counter = false

    const newYearStatus = await Database
      .table('courses')
      .select(
        'courses.id as course_id',
        'courses.name as course',
        'courses.newYear as newYearCourse',
        'classes.id as class_id',
        'classes.series as series',
        'classes.newYear as newYearClass'
      )
      .innerJoin('classes', 'courses.id', 'classes.course_id')

    const coursesStatusArray = []

    for (const elementStatus of newYearStatus) {

      counter = false

      for (const elementCourse of coursesStatusArray) {

        if (elementCourse && elementStatus.course_id == elementCourse.course_id) {

          coursesStatusArray[elementCourse.course_id].series.push({
            class_id: elementStatus.class_id,
            series: elementStatus.series,
            newYearStatus: (status => {
              return (status ? true : false)
            })(elementStatus.newYearClass)
          })
          counter = true
          continue
        }

      }
      if (counter)
        continue

      coursesStatusArray[elementStatus.course_id] = {
        course_id: elementStatus.course_id,
        course: elementStatus.course,
        nextClassStatus: (status => {
          return (status ? true : false)
        })(elementStatus.newYearCourse),
        series: [{
          class_id: elementStatus.class_id,
          series: elementStatus.series,
          newYearStatus: (status => {
            return (status ? true : false)
          })(elementStatus.newYearClass)
        }]
      }
    }

    return coursesStatusArray.slice(1)
  }

}

module.exports = NewYearController
