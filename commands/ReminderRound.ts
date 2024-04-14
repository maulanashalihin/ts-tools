import { BaseCommand } from '@adonisjs/core/build/standalone'
import Redis from '@ioc:Adonis/Addons/Redis'
import Database from '@ioc:Adonis/Lucid/Database' 
import dayjs from 'dayjs'
export default class ReminderRound extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'reminder:round'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Hello world!')



    const campaign = await Database.from("campaigns").orderBy("id",'desc').first();

    if(campaign)
    {

      if(campaign.status != 'running')
      {
        return;
      }

      const  attendances = await Database.from("campaign_attendances").where("campaign_id",campaign.id).where("reminder_round_time",'<',Date.now());

      for await (const attendee of attendances) {



        const api_key = await Database.from("api_keys").orderBy(Database.raw('RAND()')).first();

    
        if(api_key && process.env.NODE_ENV != 'development')
        {

          const message = await Database.from("messages").where("id","join").first();

          let text =  message.text.split('[current_round]').join((attendee.current_round+1));
    
          const data = {
            tg_id : attendee.tg_id,
            text : text
          }

          await Redis.sadd("queue:riayah",JSON.stringify(data))
 
        }
        await Database.from("campaign_attendances").where("id",attendee.id).update({reminder_round_time : dayjs().add(attendee.next_round_interval,'minute').valueOf()})

      }
    }

   
  }
}
