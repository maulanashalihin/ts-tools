import { BaseCommand } from '@adonisjs/core/build/standalone'
import Redis from '@ioc:Adonis/Addons/Redis'
import Database from '@ioc:Adonis/Lucid/Database'
 

export default class SendRiayahMessage extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'send:riayah_message'

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
 
    
    const campaign = await Database.from("riayahs").where("status","sending").first();

  

    if(campaign)
    {
      
      let troops;

      if(campaign.troop_id)
      {
        troops = await Database.from("troops").where("id",">",campaign.troop_id).whereNotNull('last_active').limit(600);

      }else{
        troops = await Database.from("troops").whereNotNull('last_active').limit(600);
      }

      if(troops.length == 0)
      { 
        await Database.from("riayahs").where("id",campaign.id).update({status : "done"}); 
        return;
      } 

      for await (const troop of troops) {
        
        const data = {
          tg_id : troop.tg_id,
          text : campaign.text,
          file : campaign.file
        }
        await Redis.sadd("queue:riayah",JSON.stringify(data))
        
      }


      this.logger.info("Send Message to "+troops.length+" troops")
      await Database.from("riayahs").where("id",campaign.id).update({troop_id : troops[troops.length-1].id}); 
    }

  }
}
