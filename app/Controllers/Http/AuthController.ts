import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({auth, request, response}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      await auth.use('web').attempt(email, password)
      response.redirect('/home')
    } catch {
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
