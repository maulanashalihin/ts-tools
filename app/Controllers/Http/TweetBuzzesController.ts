import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios';

export default class TweetBuzzesController {
  public async index({inertia,params}: HttpContextContract) {


    const campaign = await Database.from("campaigns").where("id",params.id).first();


    const buzzes = await Database.from("tweet_to_buzzes").where("campaign_id",params.id);

    return inertia.render('tweet-buzz',{buzzes,campaign})
  }

  public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
    const response = await axios.get("https://api.twitter.com/1.1/statuses/show.json",{params : {id : request.input("tweet_id"), tweet_mode : "extended"},headers: { Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAFnn5wAAAAAAkH1VAEbMWYhL3ELPVJUAcMlaIxw%3DdPXyF9cPxPURaYSxHZnzWaRaiiUhW38McownVmjGyc8Id3eW0K` }})

    if(response.data)
    {
      let data = request.all()

      data.text = response.data.full_text;
      data.screen_name = response.data.user.screen_name;
      data.name = response.data.user.name;
      data.click_number = 0;


      

      data.id = await Database.table("tweet_to_buzzes").insert(data)

      return data;
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({params}: HttpContextContract) {
    
    await Database.from("tweet_to_buzzes").where("id",params.id).delete();

  }
}
