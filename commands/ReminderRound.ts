import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'
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
      const  attendances = await Database.from("campaign_attendances").where("campaign_id",campaign.id).where("reminder_round_time",'<',Date.now());

      for await (const attendee of attendances) {



        const api_key = await Database.from("api_keys").orderBy(Database.raw('RAND()')).first();

    
        if(api_key && process.env.NODE_ENV != 'development')
        {

          const message = await Database.from("messages").where("id","join").first();

          let text =  message.text.split('[current_round]').join((attendee.current_round+1));
    
          await axios.post("http://api.dripsender.id/send",{
            api_key : api_key.id,
            phone : attendee.phone,
            text : text,
            type : "buttonsMessage",
            footerText : "Admin TS",
            buttons : JSON.parse(message.buttons)
          })
        }
        await Database.from("campaign_attendances").where("id",attendee.id).update({reminder_round_time : dayjs().add(attendee.next_round_interval,'minute').valueOf()})

      }
    }

   
  }
}
