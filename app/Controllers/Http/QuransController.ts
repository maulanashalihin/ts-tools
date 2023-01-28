import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import chapters from "Database/quran/chapter.json"

import quran from "Database/quran/quran.json"

import id_lang from "Database/quran/id.json"
import Redis from '@ioc:Adonis/Addons/Redis';
import axios from 'axios';

export default class QuransController {

    

    public async index({}: HttpContextContract) {
        return chapters;
    }

    public async show({params}: HttpContextContract) {
        if(params.id)
        {
            let surah = chapters[params.id-1];
            let ayats =  quran[params.id];
            return {
                surah,
                ayats
            };
        }
        
    }
    public async randomAyat({}: HttpContextContract) {
         
        let chapter = await this.getRandomArbitrary(1,114)
 

        let surah = chapters[chapter-1];
 

        let ayats =  quran[chapter];

        let fromAyatIndex = 0;

        let toAyatIndex = surah.total_verses-1;

        let bahasa = id_lang[chapter]; 

        if(surah.total_verses > 10)
        {
            fromAyatIndex = await this.getRandomArbitrary(0,surah.total_verses-9);
            toAyatIndex = fromAyatIndex+9;
            ayats = ayats.filter((item,index)=>{
                if(index >= fromAyatIndex && index <= toAyatIndex)
                return item
            })
            bahasa = bahasa.filter((item,index)=>{
                if(index >= fromAyatIndex && index <= toAyatIndex)
                return item
            })
        }

        

        return {
            surah,
            fromAyatIndex,
            toAyatIndex,
            ayats,
            bahasa
        };

        
    }

    public async adzan({params}: HttpContextContract) {
        
        let jadwal = await Redis.get("jadwal-shalat:"+params.location+":"+params.year+":"+params.month);

        if(jadwal)
        {
            return JSON.parse(jadwal)
        }else{
            let response = await axios.get(`https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${params.location}/${params.year}/${params.month}.json`)
            
            if(response.data)
            { 
                await Redis.set("jadwal-shalat:"+params.location+":"+params.year+":"+params.month,JSON.stringify(response.data));

                return response.data;
            }
        }
    }

    async getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}
