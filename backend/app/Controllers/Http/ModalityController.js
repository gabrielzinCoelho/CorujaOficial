'use strict'
//REAFTORAÇÃO (OK)
const Modality = use('App/Models/Modality')

class ModalityController{

  async show({request, response}){

    const modalities = await Modality.all()

    return modalities

  }


}

module.exports = ModalityController
