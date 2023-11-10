import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import dayjs from 'dayjs';

export default class ContentsController {
  public async index({inertia,auth}: HttpContextContract) {

    const user = auth.use("web").user;

    if(user)
    {
      const contents = await Database.from("contents").orderBy("id","desc").limit(50)
     
      return inertia.render("omoo-contents-admins",{contents})

      
    }
  }


  public async create({inertia,params,auth}: HttpContextContract) {

     
    const user = auth.use("buzzer").user;

    if(user)
    {
      const check = await Database.from("channel_admins").where("troop_id",user.id).where("channel_id",params.channel_id).first()
 
      if(check)
      {
        const strat = await Database.from("strat_plans").orderBy("id","desc").first();
 

        const channel = await Database.from("channels").where("id",params.channel_id).first() 
        
        return inertia.render("omoo-content-create",{channel,strat})
      }


      
    }

    
  }

  public async store({request,params,response}: HttpContextContract) {

    await Database.table("contents").insert(request.all())

    return response.redirect("/channel/"+params.channel_id)


  }

  public async show({inertia, auth, params}: HttpContextContract) {

    const user = auth.use("web").user;

    if(user)
    {
      if(params.id == 'pending') {
        const contents = await Database.from("contents").orderBy("id","asc").where("status", params.id)
        return inertia.render("omoo-contents-admins",{contents})
      }

      const contents = await Database.from("contents").orderBy("id","desc").where("status", params.id)
      return inertia.render("omoo-contents-admins",{contents})

      
    }
  }

  public async edit({inertia,params,auth}: HttpContextContract) {

     
    const user = auth.use("buzzer").user;

    if(user)
    {
      const check = await Database.from("channel_admins").where("troop_id",user.id).where("channel_id",params.channel_id).first()
 
      if(check)
      {
        const channel = await Database.from("channels").where("id",params.channel_id).first() 

        const content = await Database.from("contents").where("id",params.id).first()
        
        return inertia.render("omoo-content-create",{channel,content})
      }


      
    }

    
  }
  public async update({request,params}: HttpContextContract) {
    await Database.from("contents").where('id',params.id).update(request.except(['id']))
  }

  public async status({request,params}: HttpContextContract) {
    await Database.from("contents").where('id',params.id).update({
      status : request.input("status"),
      is_omoo : request.input("is_omoo"),
      publish_date : Date.now().toString()
    })
  }

  public async like({params}: HttpContextContract) {
    await Database.from("contents").where('id',params.id).increment({likes : 1,point : 1})

    return "OK"
  }

  public async dislike({params}: HttpContextContract) {
    await Database.from("contents").where('id',params.id).decrement({likes : 1,point : 1})

    return "OK"
  }
 

  public async share({request,params,auth}: HttpContextContract) {
    const user = auth.use("api").user;

    if(user)
    {
     
      await Database.from("contents").where('id',params.id).increment({share : 1,point : 1})
      await Database.from("troops").where("id",user.id).increment({score : 1})
      await Database.table("share_rates").insert({
        // @ts-ignore
        city : user.city,
        date : Date.now(),
        troop_id : user.id
      }) 
      await Database.table("omoo_histories").insert({
        troop_id : user.id,
        notes : `${user.name} share konten omoo dari ${request.input("channel_name")}`,
        content_id : params.id,
        content_type : 'omoo',
        created : Date.now()
      }) 
    }
  }

  public async dailyTweet({auth}: HttpContextContract) {
    const user = auth.use("api").user;

    if(user)
    {
      
      await Database.from("troops").where("id",user.id).increment({score : 10})
      await Database.table("omoo_histories").insert({
        troop_id : user.id,
        notes : `${user.name} telah menyelesaikan daily tweet pada tanggal ${dayjs().format("DD-MM-YYYY")}`,
        content_type : 'daily-tweet',
        created : Date.now()
      }) 
    }
  }

  

  

  public async destroy({params}: HttpContextContract) {
    await Database.from("contents").where('id',params.id).delete()
  }

  public async publist({}: HttpContextContract) {

    const contents = await Database.from("contents").select("channel_name")

    //delete null and delete duplicate channel_name
    const channel = contents.filter((item) => item.channel_name !== null).map((item) => item.channel_name).filter((value, index, self) => self.indexOf(value) === index);

    //parse channel as name and value key pair
    channel.forEach((item, index) => {
      channel[index] = {
        name: item,
      }
    });
    
    return channel;
  }

  public async omoo({request}: HttpContextContract) {

    const pubname = request.input("publisher","")

    if (pubname !== "") {
      const contents = await Database.from("contents").where("status","approved").where("is_omoo",true).where("channel_name", pubname).orderBy("id","desc").limit(100)
      return contents;
    }

    const contents = await Database.from("contents").where("status","approved").where("is_omoo",true).orderBy("id","desc").limit(100)
    
    return contents;
  }

  public async latest({request}: HttpContextContract) {

    const pubname = request.input("publisher","")

    if (pubname !== "") {
      const contents = await Database.from("contents").where("status","approved").where("channel_name", pubname).orderBy("publish_date","desc").limit(100)
      return contents;
    }

    const contents = await Database.from("contents").where("status","approved").orderBy("publish_date","desc").limit(100)
    
    return contents;
  }

  public async trending({request}: HttpContextContract) {

    const pubname = request.input("publisher","")

    if (pubname !== "") {
      const contents = await Database.from("contents").where("status","approved").where("created",">",dayjs().subtract(7,'day').valueOf()).where("channel_name", pubname).orderBy("point","desc").limit(100)
      return contents;
    }

    const contents = await Database.from("contents").where("status","approved").where("created",">",dayjs().subtract(7,'day').valueOf()).orderBy("point","desc").limit(100)
    
    return contents;
  }

  public async official({request}: HttpContextContract) {

    const pubname = request.input("publisher","")

    if (pubname !== "") {
      const contents = await Database.from("contents").where("status","approved").where("category","Official").where("channel_name", pubname).orderBy("id","desc").limit(100)
      return contents;
    }

    const contents = await Database.from("contents").where("status","approved").where("category","Official").orderBy("id","desc").limit(100)

    return contents;
  }
}
