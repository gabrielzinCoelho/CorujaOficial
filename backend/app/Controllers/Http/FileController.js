'use strict'
//REAFTORAÇÃO ()
const crypto = require('crypto')
const { extname, resolve } = require('path')

const File = use('App/Models/File')
const Database = use('Database')

class FileController {

  async store({ request, response }) {

    const file = request.file('file', {
      extnames: ['png', 'jpg', 'jpeg'],
      size: '2mb'
    })

    const fileName = `${crypto.randomBytes(16).toString('hex')}${extname(file.clientName)}`

    const fileInstanceId = await Database
      .table('files')
      .insert({
        path: fileName,
        created_at: Database.fn.now(),
        updated_at: Database.fn.now()
      })

    await file.move(resolve(__dirname, '..', '..', 'uploads'), {
      name: fileName,
      overwrite: true
    })

    if (!file.moved()) {
      return profilePic.error()
    }

    return {
      fileId: fileInstanceId
    }

  }

}

module.exports = FileController
