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

    async getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    public async ayat({}: HttpContextContract) {

        const check = await Redis.get("quran");
 

        if(check)
        {
           return JSON.parse(check)

        }else{

            let surah = await this.getRandomArbitrary(1,144)
 
            const response = await axios.get("https://equran.id/api/surat/"+surah);
            
            let data  = response.data;
 

            if(data.ayat.length >= 10)
            {
                data.fromAyat = await this.getRandomArbitrary(0,data.jumlah_ayat-9); 
                data.toAyat = data.fromAyat + 9;
                if(data.toAyat > data.jumlah_ayat)
                {
                    data.toAyat = data.jumlah_ayat
                }
            }else{
                data.fromAyat = 0;
                data.toAyat = data.jumlah_ayat;
            }
            
            await Redis.setex("quran",60*60,JSON.stringify(data))

            return response.data;
        
        }
        
    }

    
}
