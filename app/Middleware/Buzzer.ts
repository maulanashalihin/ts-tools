// @ts-nocheck
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Inertia from '@ioc:EidelLev/Inertia';
import dayjs from 'dayjs';

export default class Buzzer {
  public async handle({auth,response,request}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
      
    const check = await auth.use("buzzer").check();

    if(check)
    {
      const user  = await auth.use("buzzer").user;



      delete user?.pin_hash;

      if(request.url() != '/pin')
      {
         if(user?.pin_set == false)
        {
  

          return response.redirect("/pin")
        }
        
        if(dayjs(user.last_active).add(1,'day').isBefore(Date.now()))
        {
 
          return response.redirect("/pin")
        }
      }


      
 
     

      Inertia.share({
        errors: (ctx) => {
          return ctx.session.flashMessages.get('errors');
        },
        user : ()=> user
      }).version(() => Inertia.manifestFile('public/assets/manifest.json'));

      await next()
    }else{
      return response.redirect("/ts-login")
    }
    
  }
}


