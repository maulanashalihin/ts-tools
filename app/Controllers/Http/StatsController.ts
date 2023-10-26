import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import dayjs from 'dayjs';

export default class StatsController {
  public async index({inertia}: HttpContextContract) {

   

 
    

    return   inertia.render("omoo-stats")

  }



  public async getData({request}: HttpContextContract) {


    const from  = dayjs(request.input("from",dayjs().subtract(1,'month'))).valueOf().toString();

    const to  = dayjs(request.input("to",dayjs())).valueOf().toString();
   
    const daily_open_rate = await Database.from("open_rates").whereBetween("date",[from,to]).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");

 
    const daily_open_rate_unique = await Database.from("open_rates").whereBetween("date",[from,to]).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
    
    // open rate per city pada bulan ini
    const open_rate_per_city = await Database.from("open_rates").whereBetween("date",[from,to]).select("city").count("* as total").groupBy("city");

    
       
    const daily_share_rate = await Database.from("share_rates").whereBetween("date",[from,to]).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");

 
    const daily_share_rate_unique = await Database.from("share_rates").whereBetween("date",[from,to]).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
    
    // open rate per city pada bulan ini
    const share_rate_per_city = await Database.from("share_rates").whereBetween("date",[from,to]).select("city").count("* as total").groupBy("city");


    return {
      daily_open_rate,
      daily_open_rate_unique,
      open_rate_per_city,
      daily_share_rate,
      daily_share_rate_unique,
      share_rate_per_city
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
