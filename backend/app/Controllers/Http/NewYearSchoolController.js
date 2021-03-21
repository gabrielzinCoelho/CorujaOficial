'use strict'

const Database = use('Database')
const Class = use('App/Models/Class')
const Course = use('App/Models/Course')

class NewYearSchoolController {

  async index({ request, response }) {

    const yearSchoolSearch = await Database.table('school_years').select('year').limit(1)
    const yearSchool = yearSchoolSearch[0].year

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

    for (const element of newYearStatus) {

      if (!element.newYearCourse || !element.newYearClass)
        return response.status(200).json({
          yearSchool,
          canTurn: false
        })

    }

    return response.status(200).json({
      yearSchool,
      canTurn: true
    })

  }

  async update({ request, response }) {

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

    for (const element of newYearStatus) {

      if (!element.newYearCourse || !element.newYearClass)
        return response.status(406).json({
          message: "Não é possível virar o ano escolar."
        })

    }

    const { year } = request.body

    const affectedRows = await Database
      .table('school_years')
      .update('year', year)

    if (!affectedRows)
      return response.status(406).json({ error: `Houve problemas na atualização do ano escolar.\n${err}` })

    await Class.query().update({
      newYear: false
    })

    await Course.query().update({
      newYear: false
    })

    return response.status(200).json({ success: "Ano escolar foi atualizado com sucesso." })

  }



}

module.exports = NewYearSchoolController
