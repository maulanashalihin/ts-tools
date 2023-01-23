import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import axios from 'axios';
import {v4} from "uuid"

export default class OmooAuthsController {

  public async login({request,response}: HttpContextContract) {

    const phone = request.input("phone")

    let buzzer = await Database.from("troops").where("phone",phone).first();

    if(!buzzer)
    {  
      return response.abort("No.Handphone belum terdaftar",404)
    }


    const otp = this.getRndInteger(100000,999999)

    console.log(otp)
 

    const randomID = v4()

    await Redis.setex('otp:'+otp+":"+randomID,60*5, buzzer.id)  

    await Redis.setex("req-otp:"+phone,60*5,otp)


    const api_key = await Database.from("api_keys").orderBy(Database.raw('RAND()')).first();


    if(api_key && process.env.NODE_ENV != 'development')
    {

      const message = await Database.from("messages").where("id","otp").first();

      axios.post("http://api.dripsender.id/send",{
        api_key : api_key.id,
        phone : phone,
        text : message.text,
        type : "buttonsMessage",
        footerText : "Admin TS",
        buttons : JSON.parse(message.buttons)
      })
    }


             

    return {randomID,phone : buzzer.phone}



  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


  public async verifyOTP({request,response,auth}: HttpContextContract) {

    const otp = request.input("otp")

    const randomID = request.input("randomID")
    
    const user_id = await Redis.get('otp:'+otp+":"+randomID)
 
    if(user_id)
    {
      
      const user = await Database.from("troops").where("id",user_id).first()
 
      if(user)
      {
        await   Redis.del('otp:'+otp+":"+randomID)

        const token = await auth.use('api').generate(user) 

        return token
      }

    }

    return response.abort("User id tidak ditemukan",404)

  }

  public async check({auth}: HttpContextContract) {

    const check =  await auth.use("api").check()

    if(check)
    {
        return  await auth.use("api").user;
    }else{
        return check;
    }
  }

  public async logout({auth}: HttpContextContract) {

    
    const check = await auth.use("api").check();

    if(check)
    {
       
      await auth.use('api').logout()
 

    }
    
  }


}
