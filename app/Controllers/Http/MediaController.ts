import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import axios from 'axios';

export default class MediaController {
  public async index({inertia,params}: HttpContextContract) {


    const campaign = await Database.from("campaigns").where("id",params.id).first();


    const medias = await Database.from("medias").where("campaign_id",params.id);

    return inertia.render('tweet-media',{medias,campaign})
  }
  public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
    const response = await axios.get("https://api.twitter.com/1.1/statuses/show.json",{params : {id : request.input("tweet_id"), tweet_mode : "extended", include_entities : true},headers: { Authorization: `Bearer AAAAAAAAAAAAAAAAAAAAAFnn5wAAAAAAkH1VAEbMWYhL3ELPVJUAcMlaIxw%3DdPXyF9cPxPURaYSxHZnzWaRaiiUhW38McownVmjGyc8Id3eW0K` }})

    if(response.data)
    { 

      if(response.data.extended_entities)
      if(response.data.extended_entities.media.length)
      { 
        let data = request.all()

        data.media_url = response.data.extended_entities.media[0].media_url_https;
        data.twitter_url = response.data.extended_entities.media[0].url;
        data.type = response.data.extended_entities.media[0].type;

        

        data.id = await Database.table("medias").insert(data) 

        return data;
      } 
      
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({params}: HttpContextContract) {
    
    await Database.from("medias").where("id",params.id).delete();

  }
}
