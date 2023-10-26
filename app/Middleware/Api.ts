import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Api {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    
    const check = await auth.use("api").check();

    if(check)
    {
      
      await next()
    }else{
      return response.abort("You're not authenticate",401) 
    }
  }
}
