import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import dayjs from 'dayjs';

export default class StatsController {
  public async index({inertia}: HttpContextContract) {

    return   inertia.render("omoo-stats")
  }



  public async getData({request}: HttpContextContract) {


    const from  = dayjs(request.input("from",dayjs().subtract(1,'month'))).add(1,'day').valueOf().toString();

    const to  = dayjs(request.input("to",dayjs())).add(1,'day').valueOf().toString();
   
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

  public async getDataCity({request}: HttpContextContract) {
      
      const from  = dayjs(request.input("from",dayjs().subtract(1,'month'))).add(1,'day').valueOf().toString();
  
      const to  = dayjs(request.input("to",dayjs())).add(1,'day').valueOf().toString();
  
      let city = request.input("city", "Kota Jakarta Timur");

      city = city.split(',')

      //get open rate per city and fix date
      const open_rate = await Database.from("open_rates").whereBetween("date",[from,to]).whereIn("city", city).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");

      //get open rate unique
      const open_rate_unique = await Database.from("open_rates").whereBetween("date",[from,to]).whereIn("city", city).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
      

      //get share rate per city and fix date
      const share_rate = await Database.from("share_rates").whereBetween("date",[from,to]).whereIn("city", city).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).count("* as total").groupBy("date_only");

      //get share rate unique
      const share_rate_unique = await Database.from("share_rates").whereBetween("date",[from,to]).whereIn("city", city).select(Database.raw("DATE_FORMAT(FROM_UNIXTIME(date / 1000),'%Y-%m-%d') AS date_only")).countDistinct("troop_id as total").groupBy("date_only");
     

      return {
        city,
        open_rate,
        open_rate_unique,
        share_rate,
        share_rate_unique
      }
  }

  public async getCityName({}: HttpContextContract) {

    //get city froom open rate
    const city = await Database.from("open_rates").select("city")
 
    //delete null city and delete duplicate city
    const cityresult = city.filter((item) => item.city !== null).map((item) => item.city).filter((value, index, self) => self.indexOf(value) === index);
   
    //parse cityresult as name and value key pair
    cityresult.forEach((item, index) => {
      cityresult[index] = {
        name: item,
      }
    });


    return {
      cityresult
    }
  }

  public async getAllChannelsWithAdmins({}: HttpContextContract) {
    const channels = await Database.from("channels").select(["id", "name"]);
    const channelsWithAdmins = await Promise.all(
      channels.map(async (channel) => {
        const adminIds = await Database.from("channel_admins").where("channel_id", channel.id).select(["troop_id"]);
        const admins = await Database.from("troops").whereIn("id", adminIds.map(item=>item.troop_id)).select(["name", "phone"]);
        return { ...channel, admins };
      })
    );
    return channelsWithAdmins;
  }

  public async getTrendingKonten({request}: HttpContextContract) {

    const isOmoo = JSON.parse(request.input("omoo",false))

    const from  = dayjs(request.input("from",dayjs().subtract(1,'month'))).add(1,'day').valueOf().toString();
  
    const to  = dayjs(request.input("to",dayjs())).add(1,'day').valueOf().toString();

    //get konten by point and fix date
    const konten = await Database.from("contents").whereBetween("publish_date",[from,to]).where("is_omoo", isOmoo).orderBy("point","desc").limit(10);

    //fix date unixtime in konten
    konten.forEach((item, index) => {
      konten[index].publish_date = dayjs.unix(item.publish_date / 1000).format("YYYY-MM-DD");
    });

    return {
      konten
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
