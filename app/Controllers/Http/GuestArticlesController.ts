import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

export default class GuestArticlesController {

    public async index({}: HttpContextContract) {

        const check = await Redis.get("articles");

        if(check)
        {
           return JSON.parse(check)

        }else{

            const response = await axios.get("https://muslimahnews.net/wp-json/wp/v2/posts?_embed");
            
            await Redis.setex("articles",60*60,JSON.stringify(response.data))

            return response.data;
        
        }
        
    }

    
}
