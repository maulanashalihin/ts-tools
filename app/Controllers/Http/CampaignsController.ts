import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
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

    const total_tweet = await Database.from("campaign_attendances").where("campaign_id",params.id).sum("tweet_published as total").first()

    const tweet_submit = await Database.from("tweets").where("campaign_id",params.id).count("* as total").first()

    const tpm_stat = await Redis.hgetall("tweet-speed:"+params.id);

    const tpm_max_array = Object.values(tpm_stat)

    const tpm_max = Math.max.apply(Math, tpm_max_array);

    return inertia.render("campaign-report",{campaign,total_tweet,tweet_submit,tpm_stat,tpm_max}) 
  }

  public async startCampaign({params}: HttpContextContract) { 
      await Database.from("campaigns").where("id",params.id).update({status : "running"})
    return "OK"
  }

  public async endCampaign({params}: HttpContextContract) { 
      await Database.from("campaigns").where("id",params.id).update({status : "done"})
    return "OK"
  }

  
 

  public async troops({inertia,params}: HttpContextContract) { 
    
    const campaign = await Database.from("campaigns").where("id",params.id).first()

    const troops = await Database.from("campaign_attendances").where("campaign_id",campaign.id).orderBy("action_score","desc")

    return inertia.render("campaign-troops",{campaign,troops}) 
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
        troop_tg_id : user.tg_id,
        next_round_interval : 60
      }

      attendance.id = await Database.table("campaign_attendances").insert(attendance);

      await Database.from("campaigns").where("id",params.id).increment({
        attendee  : 1
      })

      await Database.from("troops").where("id",user.id).update({last_active : Date.now()}); 

   

      const message = await Database.from("messages").where("id","join").first();

      let text = message.text.split('[title]').join(campaign.title);
      
      text =  text.split('[time]').join(dayjs(campaign.time).subtract(1,'h').format("DD-MM-YYYY HH:mm")+" WIB");

      
      const data = {
        tg_id : user.tg_id,
        text : text
      }

      await Redis.sadd("queue:riayah",JSON.stringify(data))

      

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

   public async updateScore({params,auth,request}: HttpContextContract) {
    
    
    if(request.input("is_tweet"))
    {
      await Database.from("campaign_attendances").where("id",params.id).increment({
        action_score : 1,
        tweet_published : 1
      })

      const time = dayjs().format("YYYY-MM-DDTHH:mm")

      const incrTime = await Redis.incr("speed"+time)

      await Redis.hset("tweet-speed:"+request.input("campaign_id"),time,incrTime)

    }else{
      await Database.from("campaign_attendances").where("id",params.id).increment({
        action_score : 1,
      })
    }
    

      // @ts-ignore:next-line
    const user = await auth.use("buzzer").user;
 

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
