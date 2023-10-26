import Hash from '@ioc:Adonis/Core/Hash'
import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios';
import {v4} from "uuid"

export default class TroopsController {
  public async home({inertia}: HttpContextContract) {
    const campaigns = await Database.from("campaigns").where("status","!=","done").orderBy("id","desc").limit(8)

    
 
    return inertia.render("ts-home",{campaigns})
  }


  

  public async create({}: HttpContextContract) {}

  public async store({auth,request}: HttpContextContract) {

      
    const user = auth.use("buzzer").user;

    if(user)
    {

      const twitter_username = request.input("twitter_username")
      const city = request.input("city")
      const gender = request.input("gender")
      const phone = request.input("phone") || user.phone;

      await Database.from("troops").where("id",user.id).update({
        twitter_username,
        city,
        gender,
        phone

      })
    }

    return "OK"

    

  }

  public async show({}: HttpContextContract) {}

  public async edit({inertia,auth}: HttpContextContract) {

      
    const user = auth.use("buzzer").user;

    return inertia.render("ts-profile",{user})
  }

  public async history({inertia,auth}: HttpContextContract) {

    
    const user = auth.use("buzzer").user;

    if(user)
    {
      const histories = await Database.from("campaign_attendances").where("troop_id",user.id)

      return inertia.render("ts-history",{user,histories})
    }
    
  }

  public async leaderboard({inertia,auth}: HttpContextContract) {

    
    const user = auth.use("buzzer").user;

    if(user)
    {
      const leaderboards = await Database.from("troops").orderBy("score","desc").limit(100);
 

      return inertia.render("ts-leaderboard",{user,leaderboards})
    }
    
  }

  public async index({inertia,request}: HttpContextContract) {

     

    const troops = await Database.from("troops").select(['id','score','twitter_username','name','blocked']).orderBy("score","desc").paginate(request.input("page",1),100);
 
    return inertia.render("troops",{troops})
    
  }

  public async download({response}: HttpContextContract) {
    
    const troops = await Database.from("troops")
 
    let csvData = "name,phone,city\n";

    for await (const item of troops) {
      csvData+=`${item.twitter_username},${item.phone},${item.city}\n`
    }

    return response.header("Content-Type","text/csv").header("Content-Disposition","attachment; filename=troops.csv").send(csvData)
  }




  public async profile({auth,request,response}: HttpContextContract) {

     
    const user = auth.use("buzzer").user;

    if(user)
    await Database.from("troops").where("id",user.id).update(request.except(['id']))

    return response.redirect().back()

  }

  public async update({params,request}: HttpContextContract) {

     

 
   await Database.from("troops").where("id",params.id).update(request.except(['id']))

   return "OK"

 }

  public async destroy({}: HttpContextContract) {}

  public async requestOTP({request}: HttpContextContract) {

     const phone = request.input("phone");

     const otp = await Redis.get("req-otp:"+phone)
    
     if(otp)
     { 
        return {
          reply : true,
          text : `Kode OTP anda adalah ${otp}`
        }
     }else{
      return {
        reply : true,
        text : `Maaf, Nomor ini belum terdaftar/login`
      }
     }

    
  }

  


  public async logout({auth,response}: HttpContextContract) {

    
    const check = await auth.use("buzzer").check();

    if(check)
    {
       
      await auth.use('buzzer').logout()

      return response.redirect("/ts-login")

    }else{
      return response.redirect("/ts-login")
    }
    
  }

  

  public async register({request,inertia}: HttpContextContract) {

    const phone = request.input("phone")

    let buzzer = await Database.from("troops").where("phone",phone).first();

    if(!buzzer) 
    {
      buzzer = {
        phone,
        twitter_username : request.input("twitter_username"),
        city : request.input("city")
      }
     buzzer.id =  await Database.table("troops").insert(buzzer)
    }


    const otp = this.getRndInteger(100000,999999)

    console.log(otp)
 

    const randomID = v4()

    await Redis.setex('otp:'+otp+":"+randomID,60*5, buzzer.id)  

    await Redis.setex("req-otp:"+phone,60*5,otp)
 

    const api_key = await Database.from("api_keys").orderBy(Database.raw('rand()')).first();

    if(process.env.NODE_ENV != 'development')
    {



      if(api_key)
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
    }


             

    return inertia.render("ts-otp",{randomID,phone : buzzer.phone})



  }


  public async login({request,inertia,response,session}: HttpContextContract) {
    const phone = request.input("phone")

    let buzzer = await Database.from("troops").where("phone",phone).first();

    if(!buzzer)
    { 
      session.flash('errors', 'No.Handphone belum terdaftar')
      return response.redirect().back() 
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


             

    return inertia.render("ts-otp",{randomID,phone : buzzer.phone})



  } 
  public async verifyToken({request,response,auth,session}: HttpContextContract) {

    const ott = request.input("token")
 
    const user_id = await Redis.get(`token:`+ott)
 

    if(user_id)
    {
      
      await Database.from("troops").where("id",user_id).update({last_active : Date.now()})

      await auth.use('buzzer').loginViaId(user_id)  

      await Redis.del(`token:`+ott)
 
      
      return response.redirect("/pin")

    }

    session.flash("errors","Maaf, Token yang anda masukan salah.")


    return response.redirect("/ts-login")

  }

  public async verifyOTP({request,response,auth}: HttpContextContract) {

    const otp = request.input("otp")

    const randomID = request.input("randomID")
    
    const user_id = await Redis.get('otp:'+otp+":"+randomID)

    if(user_id)
    {
      
      await auth.use('buzzer').loginViaId(user_id)  

      await Redis.del('otp:'+otp)

      return response.redirect("/",false,303)

    }

    return response.redirect("/ts-login")

  }

  public async pin({inertia}: HttpContextContract) {

     
    return inertia.render("ts-pin")

  }

  public async setPin({request,auth,response,session}: HttpContextContract) {

    const pin = request.input("pin")

    const user = await auth.use("buzzer").user;

    const counter = await Redis.incr("login-trial:"+user?.id)

    await Redis.expire("login-trial:"+user?.id,600)
    
    

    if(pin && user)
    {
    

      if(user.pin_set)
      {

        const troop = await Database.from("troops").where("id",user.id).select(["pin_hash"]).first()

        if (await Hash.verify(troop.pin_hash, pin)) {
          
          
          // verified
          await Database.from("troops").where("id",user.id).update({last_active : Date.now()})
          
          await Redis.expire("login-trial:"+user?.id,0)

          return response.redirect("/")

        }else{
          

          if(counter >= 3)
          {
    
            session.flash("errors","Maaf, Anda telah lebih dari 3x percobaan memasukan PIN")
            
            await Database.from("troops").where("id",user.id).update({blocked : true})
    
            await auth.use('buzzer').logout()
            
            return response.redirect("/ts-login")
    
          }else{

            session.flash("errors","Maaf, PIN yang dimasukan salah") 
          
            return response.redirect("/pin")

          }

         

          // not authenticated
       
        }

      }else{

        const pin_hash = await Hash.make(pin);
          
          await Database.from("troops").where("id",user.id).update({pin_hash, last_active : Date.now(), pin_set : true})
          
          await Redis.expire("login-trial:"+user?.id,0)

          return response.redirect("/")

      }
    } 

  }

    getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
}


