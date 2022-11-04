import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios';
import {v4} from "uuid"

export default class TroopsController {
  public async home({inertia}: HttpContextContract) {
    const campaigns = await Database.from("campaigns").orderBy("id","desc").limit(8)

    
 
    return inertia.render("ts-home",{campaigns})
  }


  

  public async create({}: HttpContextContract) {}

  public async store({auth,request}: HttpContextContract) {

      // @ts-ignore:next-line
    const user = auth.use("buzzer").user;

    if(user)
    {

      const twitter_username = request.input("twitter_username")

      await Database.from("troops").where("id",user.id).update({
        twitter_username

      })
    }

    return "OK"

    

  }

  public async show({}: HttpContextContract) {}

  public async edit({inertia,auth}: HttpContextContract) {

      // @ts-ignore:next-line
    const user = auth.use("buzzer").user;

    return inertia.render("ts-profile",{user})
  }

  public async history({inertia,auth}: HttpContextContract) {

    // @ts-ignore:next-line
    const user = auth.use("buzzer").user;

    if(user)
    {
      const histories = await Database.from("campaign_attendances").where("troop_id",user.id)

      return inertia.render("ts-history",{user,histories})
    }
    
  }

  public async leaderboard({inertia,auth}: HttpContextContract) {

    // @ts-ignore:next-line
    const user = auth.use("buzzer").user;

    if(user)
    {
      const leaderboards = await Database.from("troops").orderBy("score","desc").limit(25);

      console.log(leaderboards)

      return inertia.render("ts-leaderboard",{user,leaderboards})
    }
    
  }

  public async index({inertia,request}: HttpContextContract) {

    // @ts-ignore:next-line 

    const troops = await Database.from("troops").select(['id','score','twitter_username']).orderBy("score","desc").paginate(request.input("page",1),25);
 
    return inertia.render("troops",{troops})
    
  }

  public async download({response}: HttpContextContract) {
    
    const troops = await Database.from("troops")
 
    let csvData = "name,phone\n";

    for await (const item of troops) {
      csvData+=`${item.twitter_username},${item.phone}\n`
    }

    return response.header("Content-Type","text/csv").header("Content-Disposition","attachment; filename=troops.csv").send(csvData)
  }




  public async update({auth,request,response}: HttpContextContract) {

     // @ts-ignore:next-line
    const user = auth.use("buzzer").user;

    if(user)
    await Database.from("troops").where("id",user.id).update(request.except(['id']))

    return response.redirect().back()

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
     }

    
  }

  


  public async logout({auth,response}: HttpContextContract) {

    // @ts-ignore:next-line
    const check = await auth.use("buzzer").check();

    if(check)
    {
       // @ts-ignore:next-line
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
        footerText : "TS Admin",
        buttons : JSON.parse(message.buttons)
      })
    }


             

    return inertia.render("ts-otp",{randomID,phone : buzzer.phone})



  }

  public async verifyOTP({request,response,auth}: HttpContextContract) {

    const otp = request.input("otp")

    const randomID = request.input("randomID")
    
    const user_id = await Redis.get('otp:'+otp+":"+randomID)

    if(user_id)
    {
      // @ts-ignore:next-line
      await auth.use('buzzer').loginViaId(user_id)  

      await Redis.del('otp:'+otp)

      return response.redirect("/",false,303)

    }

    return response.redirect("/ts-login")

  }

    getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
}
