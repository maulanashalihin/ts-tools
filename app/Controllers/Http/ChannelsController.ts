import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ChannelsController {
  public async index({inertia,auth}: HttpContextContract) {
 
        const user = auth.use("buzzer").user;

        if(user)
        {
          const channel_id = await Database.from("channel_admins").where("troop_id",user.id).select(['channel_id']);

          const channels = await Database.from("channels").whereIn("id",channel_id.map(item=>item.channel_id))

          return inertia.render("omoo-channels",{channels})

        }
    
  }

  public async admins({inertia,auth}: HttpContextContract) {
 
    const user = auth.use("web").user;

    if(user)
    { 

      const channels = await Database.from("channels");

      return inertia.render("omoo-channels-admins",{channels})

    }

}

  public async create({inertia}: HttpContextContract) {
    
    return inertia.render("omoo-channel-create")
  }

  public async store({request,response,auth}: HttpContextContract) {


     
    const user = auth.use("buzzer").user;

    if(user)
    {
      const channel_id = await Database.table("channels").insert({
        name : request.input("name"),
        avatar : request.input("avatar")
      })
      await Database.table("channel_admins").insert({
        troop_id : user.id,
        channel_id
      })

      return response.redirect("/channel/"+channel_id)
    }

   
   
  }

  public async show({params,inertia,auth}: HttpContextContract) {

     
      const user = auth.use("buzzer").user;

      if(user)
      {
        const check = await Database.from("channel_admins").where("troop_id",user.id).where("channel_id",params.id).first()

        if(check)
        {
          const channel = await Database.from("channels").where("id",params.id).first()
    
          const contents = await Database.from("contents").where("channel_id",params.id)
      
          return inertia.render("omoo-contents",{contents,channel})
        }


        
      }
   
  }

  public async edit({params,inertia}: HttpContextContract) {

    const channel = await Database.from("channels").where("id",params.id).first()

    return inertia.render("omoo-channel-create",{channel})

  }

  public async update({auth,request,response,params}: HttpContextContract) {


     
      const user = auth.use("buzzer").user;

      if(user)
      {
        const channel_id = await Database.from("channels").where("id",params.id).update(request.except(['id'])) 
  
        return response.redirect("/channel/"+channel_id)
      }

  }

  public async makeOfficial({auth,request,params}: HttpContextContract) {


     
    const user = auth.use("web").user;

    if(user)
    {

       await Database.from("channels").where("id",params.id).update(request.except(['id'])) 

    
    }

}

  public async destroy({}: HttpContextContract) {}
}