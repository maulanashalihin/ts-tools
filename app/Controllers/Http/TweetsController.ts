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

    const tweets = await Database.from("tweets").where("campaign_id",params.id).limit(25);

    const pathname = "all-tweets"

 
   const counts =  await Database.from("tweets").where("campaign_id",params.id).count("* as total").groupBy('status').distinct('status')

   console.log(counts)

    return inertia.render("tweets",{campaign,tweets,pathname,counts})
  }

  public async onlyTweets({request}: HttpContextContract) {
    
    const page = request.input("page",0)
     
    const tweets = await Database.from("tweets").where("campaign_id",request.input("campaign_id")).offset(25*page).limit(25);  

    return tweets;
  }

  

  public async create({}: HttpContextContract) {}

  public async store({request,response}: HttpContextContract) {

    const data = request.all();

    await Database.table("tweets").insert(data)

    if(data.published_by)
    {
      await Database.from("campaign_attendances").where("campaign_id",data.campaign_id).where("troop_id",data.published_by).increment({
        action_score : 3,
        tweet_submit_number : 1
      })

      await Database.from("troops").where("id",data.published_by).increment({
        score : 3
      })
    }
    
    return response.redirect().back()
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({params,request}: HttpContextContract) {

    await Database.from("tweets").where("id",params.id).update(request.except(['id']))

    if(request.input('status') == 'published')
    {
      await Database.from("campaign_attendances").where("campaign_id",request.input('campaign_id')).where("troop_id",request.input('published_by')).increment({
        action_score : 3
      })

      await Database.from("troops").where("id",request.input('published_by')).increment({
        score : 3
      })
    }

    if(request.input('status') == 'rejected')
    {
      await Database.from("campaign_attendances").where("campaign_id",request.input('campaign_id')).where("troop_id",request.input('published_by')).decrement({
        action_score : 3
      })

      await Database.from("troops").where("id",request.input('published_by')).decrement({
        score : 3
      })
    }
  }

  public async destroy({}: HttpContextContract) {}
}
