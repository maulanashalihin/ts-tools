// @ts-nocheck
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Inertia from '@ioc:EidelLev/Inertia';

export default class Buzzer {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
      
    const check = await auth.use("buzzer").check();

    if(check)
    {
      Inertia.share({
        errors: (ctx) => {
          return ctx.session.flashMessages.get('errors');
        },
        user : ()=> auth.use("buzzer").user
      }).version(() => Inertia.manifestFile('public/assets/manifest.json'));

      await next()
    }else{
      return response.redirect("/ts-login")
    }
    
  }
}


