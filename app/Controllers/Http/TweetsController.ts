import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TweetsController {
  public async index({inertia,params}: HttpContextContract) {
    
    const campaign = await Database.from("campaigns").where("id",params.id).first();

    let incr = await Redis.get("incr:"+campaign.id) as any;

    if(incr)
    {
     
      await Redis.incr("incr:"+campaign.id)
    }else{
      incr = 0;
      await Redis.setex("incr:"+campaign.id,60*5,1);
    }

   

    const tweets = await Database.from("tweets").where("campaign_id",params.id).where("status","on review").offset(25*incr).limit(25); 

    if(tweets.length < 25)
    {
      await Redis.del("incr:"+campaign.id)
    }

    const counts = await Database.from("tweets").where("campaign_id",params.id).where("status","on review").count("* as total").first();

    const pathname = "onreview-tweets"

    return inertia.render("tweets",{campaign,tweets,pathname,counts : counts.total})
  }

  public async allTweet({inertia,params}: HttpContextContract) {
    
    const campaign = await Database.from("campaigns").where("id",params.id).first();

    const tweets = await Database.from("tweets").where("campaign_id",params.id)

    const pathname = "all-tweets"

    return inertia.render("tweets",{campaign,tweets,pathname})
  }

  

  public async create({}: HttpContextContract) {}

  public async store({request,response}: HttpContextContract) {

    const data = request.all();

    await Database.table("tweets").insert(data)

    if(data.published_by)
    {
      await Database.from("campaign_attendances").where("campaign_id",data.campaign_id).where("troop_id",data.published_by).increment({
        action_score : 5,
        tweet_submit_number : 1
      })

      await Database.from("troops").where("id",data.published_by).increment({
        score : 5
      })
    }
    
    return response.redirect().back()
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({params,request}: HttpContextContract) {

    await Database.from("tweets").where("id",params.id).update(request.except(['id']))
  }

  public async destroy({}: HttpContextContract) {}
}
