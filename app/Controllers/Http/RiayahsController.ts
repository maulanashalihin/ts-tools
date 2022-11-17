import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RiayahsController {
  public async index({inertia}: HttpContextContract) {

    const campaigns = await Database.from("riayahs").orderBy("id","desc").limit(10);

    for await (const campaign of campaigns) {
      
      campaign.buttons = campaign.buttons.split(",")
    }
    return inertia.render("riayah",{campaigns})
  }

  public async create({inertia}: HttpContextContract) { 
    return inertia.render("riayah-create")

  }

  public async store({request,response}: HttpContextContract) {
    
    await Database.table("riayahs").insert(request.all())

    return response.redirect("/riayah")

  }

  public async show({}: HttpContextContract) {}

  public async edit({inertia,params}: HttpContextContract) {

    let campaign = await Database.from("riayahs").where("id",params.id).first()

    campaign.buttons = campaign.buttons.split(",")

    return inertia.render("riayah-create",{campaign})
  }

  public async update({request,response,params}: HttpContextContract) {
    
    let data = request.except(['id']);

    data.buttons = data.buttons.join(",")

    await Database.from("riayahs").where("id",params.id).update(data)

    return response.redirect("/riayah",false,303)

  }

  public async destroy({}: HttpContextContract) {}
}
