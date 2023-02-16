import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import axios from 'axios';
import {v4} from "uuid"
import Hash from '@ioc:Adonis/Core/Hash'

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

  public async profile({auth,request}: HttpContextContract) {

     
    const user = auth.use("api").user;

    if(user)
    await Database.from("troops").where("id",user.id).update(request.except(['id']))

    return "OK"

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

  public async verifyToken({request,response,auth}: HttpContextContract) {

    const ott = request.input("token")
 
    const user_id = await Redis.get(`token:`+ott)
 

    if(user_id)
    {
       
      const user = await Database.from("troops").where("id",user_id).first()
 
      if(user)
      {
        await Database.from("troops").where("id",user_id).update({last_active : Date.now()})

        await Redis.del(`token:`+ott)

        const token = await auth.use('api').generate(user) 

        return token

      }
      
    

    }

    return response.abort("User id tidak ditemukan",404)

  }


  public async setPin({request,auth,response}: HttpContextContract) {

    const pin = request.input("pin")

    const user = await auth.use("api").user;

    const counter = await Redis.incr("login-trial:"+user?.id)

    await Redis.expire("login-trial:"+user?.id,600)
    
    console.log(user)
    

    if(pin && user)
    {
    

      if(user.pin_set)
      {

        const troop = await Database.from("troops").where("id",user.id).select(["pin_hash"]).first()

        if (await Hash.verify(troop.pin_hash, pin)) {
          
          
          // verified
          await Database.from("troops").where("id",user.id).update({last_active : Date.now()})
          
          await Redis.expire("login-trial:"+user?.id,0)

          return "OK"

        }else{
          

          if(counter >= 3)
          {
     
            await Database.from("troops").where("id",user.id).update({blocked : true})
    
            await auth.use('api').logout()
            
            return response.abort("Maaf, Anda telah lebih dari 3x percobaan memasukan PIN")
    
          }else{
 
          
            return response.abort("Maaf, PIN yang dimasukan salah")

          }

         

          // not authenticated
       
        }

      }else{

        const pin_hash = await Hash.make(pin);
          
          await Database.from("troops").where("id",user.id).update({pin_hash, last_active : Date.now(), pin_set : true})
          
          await Redis.expire("login-trial:"+user?.id,0)

          return "OK"

      }
    } 

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
