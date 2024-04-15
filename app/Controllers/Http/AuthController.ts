 
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'


export default class AuthController {
  public async login({auth, request, response}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')


    try {
      
    } catch (error) {
      
    }
    try { 

      const user = await Database.from("users").where('email', email).first();

      if(user)
      {
        if (await Hash.verify(user.password, password)) {
          // verified 
          await auth.use("web").login(user)

          response.redirect('/home')
        }
      }

      
    } catch (error){
      console.log(error)
      return response.badRequest('Invalid credentials')
    }
  } 


  public async logout({auth,response}: HttpContextContract) {

    // @ts-ignore:next-line
    const check = await auth.use("web").check();

    if(check)
    {
       // @ts-ignore:next-line
      await auth.use('web').logout()

      return response.redirect("/login")

    }else{
      return response.redirect("/login")
    }
    
  }
}
