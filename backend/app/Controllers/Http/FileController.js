'use strict'
//REAFTORAÇÃO (OK)
const crypto = require('crypto')
const { extname, resolve } = require('path')
const fs = require('fs')

const File = use('App/Models/File')
const Database = use('Database')

class FileController {

  async store({ request, response }) {

    const file = request.file('file', {
      extnames: ['png', 'jpg', 'jpeg'], //extensões de arquivos aceitas
      size: '2mb' //tamanho máximo dos arquivos
    })

    // nome aleatório e único gerado para cada arquivo,mantendo a extensão do nome original
    const fileName = `${crypto.randomBytes(16).toString('hex')}${extname(file.clientName)}`

    //é inserido a instância do arquivo no banco
    const fileInstanceId = await Database
      .table('files')
      .insert({
        path: fileName,
        created_at: Database.fn.now(),
        updated_at: Database.fn.now()
      })

    // depois o arquivo é movido para o diretório ./backend/app/uploads
    await file.move(resolve(__dirname, '..', '..', 'uploads'), {
      name: fileName,
      overwrite: true
    })

    // exceção gerada caso o arquivo não seja movido corretamente
    if (!file.moved()) {
      return profilePic.error()
    }

    //o id da instância do arquivo salva no banco é retornada
    return {
      fileId: fileInstanceId[0],
      path: fileName
    }

  }

  async index({request, response}){

    const {file_id} = request.params

    try{
      const file = await File.findOrFail(file_id)
      return file
    }catch(error){
      return response.status(406).json({ error: "Nenhum arquivo foi encontrado." })
    }

  }

async destroy({request, response}){

  //apagar imagem da pasta de uploads, remover instancia da imagem no banco,

  const {file_id} = request.params

  try{
    const fileInstance = await File.findOrFail(file_id)
    await fileInstance.delete()

    fs.unlinkSync(resolve(__dirname, '..', '..', 'uploads', fileInstance.path))

    return fileInstance

  }catch(error){
    return response.status(406).json({ error: "Nenhum arquivo foi encontrado." })
  }


}

}

module.exports = FileController


//a ideia é que a rota de inserir arquivos seja exclusiva
//no caso de fazer um upload de arquivo que está vinculado a um usuário, por exemplo,
//primeiro é realizado o upload do arquivo, separadamente, após isso, o id do arquivo salvo é retornado,
// e então esse id é salvo na tabela desse usuário
