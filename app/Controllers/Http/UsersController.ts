import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {
  public async index({inertia}: HttpContextContract) { 

       const users = await Database.from("users").select(['id','name','email'])
 
       return inertia.render("users",{users})

  }

  public async create({inertia}: HttpContextContract) {

    return inertia.render("user-create")
  }

  public async store({request,response}: HttpContextContract) {
    await User.create(
      {
        name : request.input("name"),
        email : request.input("email"),
        password : request.input("password")
      }
    )

    return response.redirect('/users')
  }

  public async show({}: HttpContextContract) {}

  public async edit({inertia,params}: HttpContextContract) {
  
    const users = await Database.from("users").where("id",params.id).select(['id','name','email'])

    return inertia.render("user-create",{users})

  }


  public async update({params,request,response}: HttpContextContract) {
    const user = await User.query().where("id",params.id).first();
    
    if(user)
    {
      if(request.input("name"))
      {
        user.name = request.input("name")
      }

      if(request.input("email"))
      {
        user.email = request.input("email")
      }

      if(request.input("password"))
      {
        user.password = request.input("password")
      }
    }
    
     

    return response.redirect('/users',false,303)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    //no content -- success delete
    return response.status(204)
  }
}
