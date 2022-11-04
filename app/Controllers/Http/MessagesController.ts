import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class MessagesController {
  public async index({inertia}: HttpContextContract) {

    const messages = await Database.from("messages");

    for await (const item of messages) {
      item.buttons = JSON.parse(item.buttons)
    }

    const api_keys = await Database.from("api_keys")

    return inertia.render("messages",{messages,api_keys})
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async storeApiKey({request}: HttpContextContract) {
    await Database.table("api_keys").insert({
      id : request.input("id")
    })
  }

  public async deleteApiKey({params}: HttpContextContract) {
    await Database.from("api_keys").where("id",params.id).delete()
  }

  public async update({params,request}: HttpContextContract) {
    
    let data = request.except(['id']);
    
    data.buttons = JSON.stringify(data.buttons)

    await Database.from("messages").where("id",params.id).update(data)
  }

  public async destroy({}: HttpContextContract) {}
}
