import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'
import dayjs from 'dayjs'

export default class CampaignsController {
  public async index({inertia}: HttpContextContract) {
    const campaigns = await Database.from("campaigns").orderBy("id","desc").limit(16)
    
    for await (const campaign of campaigns) {
      if(campaign.status == 'tweet submission')
      {
        campaign.tweets = await Database.from("tweets").where("campaign_id",campaign.id).count("* as total").first()
      }
    }

    return inertia.render("home",{campaigns})
  }

  public async create({inertia}: HttpContextContract) {
    return inertia.render("campaign-create")
  }

  public async report({inertia,params}: HttpContextContract) { 
    const campaign = await Database.from("campaigns").where("id",params.id).first()
    return inertia.render("campaign-report",{campaign}) 
  }

  public async store({request,response}: HttpContextContract) {
    let data = request.all() 
    await Database.table("campaigns").insert(data)
    return response.redirect("/home")
  }

  public async show({params,inertia,auth}: HttpContextContract) {


      // @ts-ignore:next-line
    const user = await auth.use("buzzer").user;
    
    if(!user)
    {
      return;
    }

    const campaign = await Database.from("campaigns").where("id",params.id).first();

    let attendance = await Database.from("campaign_attendances").where("campaign_id",campaign.id).where("troop_id",user.id).first();

    if(!attendance)
    {
      attendance = 
      {
        campaign_id : campaign.id,
        campaign_title : campaign.title,
        campaign_time : campaign.time,
        troop_id : user.id,
        troop_username : user.twitter_username,
        troop_phone : user.phone,
        next_round_interval : 60
      }

      attendance.id = await Database.table("campaign_attendances").insert(attendance);

      await Database.from("campaigns").where("id",params.id).increment({
        attendee  : 1
      })

      await Database.from("troops").where("id",user.id).update({last_active : Date.now()}); 

      const api_key = await Database.from("api_keys").orderBy(Database.raw('RAND()')).first();


      if(api_key && process.env.NODE_ENV != 'development')
      {

        const message = await Database.from("messages").where("id","join").first();

        let text = message.text.split('[title]').join(campaign.title);
        
        text =  text.split('[time]').join(dayjs(campaign.time).subtract(1,'h').format("DD-MM-YYYY HH:mm")+" WIB");

        axios.post("http://api.dripsender.id/send",{
          api_key : api_key.id,
          phone : user.phone,
          text : text,
          type : "buttonsMessage",
          footerText : "Admin TS",
          buttons : JSON.parse(message.buttons)
        })
      }

      

    }

    if(campaign.status == 'tweet submission')
    {
      


      const tweets = await Database.from("tweets").where("published_by",user.id); 

      return inertia.render("ts-submit-tweet",{campaign,tweets,attendance})
    }

    if(campaign.status == 'running')
    {


      const tweets = await Database.from("tweets").where("campaign_id",campaign.id).where("status","published").limit(campaign.tweet_per_round).orderBy(Database.raw('RAND()')); 

      const buzzes = await Database.from("tweet_to_buzzes").where("campaign_id",campaign.id).limit(campaign.tweet_love_and_retweet_per_round).orderBy(Database.raw('RAND()')); 

      const replies = await Database.from("tweet_to_buzzes").where("campaign_id",campaign.id).limit(campaign.tweet_reply_per_round).orderBy(Database.raw('RAND()'));  

      const medias = await Database.from("medias").where("campaign_id",campaign.id);

      const profiles = await Database.from("campaign_attendances").where("campaign_id",campaign.id).select(['troop_username']).limit(campaign.follow_profile_per_round).orderBy(Database.raw('RAND()'))

      return inertia.render("ts-running-campaign",{campaign,tweets,attendance,buzzes,replies,medias,profiles})
    }


  }

  public async edit({params,inertia}: HttpContextContract) {
    const campaign = await Database.from("campaigns").where("id",params.id).first()
    return inertia.render("campaign-create",{campaign})
  }

  public async update({request,response,params}: HttpContextContract) {
    let data = request.except(['id']) 
    await Database.from("campaigns").where("id",params.id).update(data)
    return response.redirect("/home",false,303)
  }

  public async updateAttendance({request,params}: HttpContextContract) {
    
    let data = request.except(['id']) 

    await Database.from("campaign_attendances").where("id",params.id).update(data)

    return "OK"
  }

   public async updateScore({params,auth}: HttpContextContract) {
    
    await Database.from("campaign_attendances").where("id",params.id).increment({
      action_score : 1
    })

      // @ts-ignore:next-line
    const user = await auth.use("buzzer").user;

    console.log(user)

    if(user)
    await Database.from("troops").where("id",user.id).increment({
      score : 1
    })

    return "OK"
  }

  

  

  public async destroy({params,response}: HttpContextContract) {
    
    await Database.from("campaigns").where("id",params.id).delete()
    await Database.from("tweets").where("campaign_id",params.id).delete()
    await Database.from("tweet_to_buzzes").where("campaign_id",params.id).delete()
    await Database.from("medias").where("campaign_id",params.id).delete()
    await Database.from("campaign_attendances").where("campaign_id",params.id).delete()

    return response.redirect("/home",false,303)
  }
}
