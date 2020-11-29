'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// carograph

Route.get(
  'carograph/course/:course_id/series/:series/year/:year',
  'StudentHistoricController.show'
).middleware(['auth:jwt'])

Route.get(
  'carograph/seedCarographObject/yearStart/:yearStart/yearEnd/:yearEnd',
  'StudentHistoricController.seedCarographObject'
)

Route.get(
  'carograph/newYearObject',
  'StudentHistoricController.newYearObject'
)

Route.post(
  'carograph/newYear',
  'StudentHistoricController.newYear'
)

Route.post(
  'carograph/seedCarograph',
  'StudentHistoricController.seedCarograph'
)

// modality

Route.get(
  'modalities',
  'ModalityController.show'
).middleware(['auth:jwt'])

// course

Route.get(
  'courses/modality/:modality_id',
  'CourseController.index'
).middleware(['auth:jwt'])

// student

Route.get(
  'student/:id',
  'StudentController.index'
)

Route.put(
  'student/:id',
  'StudentController.update'
)

// session

Route.post(
  '/pedagogue/login',
  'SessionController.store'
)

// autenticação

Route.get(
  '/authentication',
  'SessionController.index'
).middleware(['auth:jwt'])

// forgot Password

Route.post(
  '/pedagogue/forgotPassword',
  'ForgotPasswordController.store'
)

Route.put(
  '/pedagogue/resetPassword',
  'ForgotPasswordController.update'
)

// pedagogue

Route.post(
  '/pedagogue',
  'PedagogueController.store'
)

// files

Route.post(
  'files',
  'FileController.store'
).middleware(['auth:jwt'])

// alteração rota .get('carograph/seedCarographObject/yearStart/:yearStart/yearEnd/:yearEnd')
// funcionalidade de virada de ano
// refatoração de código (tratamento de erros e exceções )
// upload de arquivos
// seed e virada ano carógrafo através planilha excel

//rota retorna object seeder, object virada de ano
// funcionalidade de virada de ano
// refatoração StudentHistoricController.js
