import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StratPlansController {
  public async index({inertia}: HttpContextContract) {

    const strats = await Database.from("strat_plans").orderBy("id","desc").limit(20);

    return inertia.render("strat-plans",{strats})
  }

  public async create({inertia}: HttpContextContract) {

    return inertia.render("strat-plans-create")
  }

  public async store({request,response}: HttpContextContract) {

    let data = request.all() 
  
    await Database.table("strat_plans").insert(data)
  
    return response.redirect("/strat-plan")
  
  }

  public async show({}: HttpContextContract) {}

  public async edit({params,inertia}: HttpContextContract) {
 
    const Project = await Database.from("strat_plans").where("id",params.id).first()
 
    return inertia.render("strat-plans-create",{Project})
  }

  public async update({}: HttpContextContract) {}

  public async destroy({params,response}: HttpContextContract) {
    
    await Database.from("strat_plans").where("id",params.id).delete()

    return response.redirect("/strat-plan",false,303)

  }
}
