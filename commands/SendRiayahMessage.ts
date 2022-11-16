import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import axios from 'axios'

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
    this.logger.info('Hello world!')
    
    const campaign = await Database.from("riayahs").where("status","sending").first();

    const api_keys = await Database.from("api_keys")

    if(campaign)
    {
        if(campaign.last_troop_id)
        {

          let troops;

          if(campaign.troop_id)
          {
            troops = await Database.from("troops").where("id",">=",campaign.troop_id).limit(api_keys.length*6);

          }else{
            troops = await Database.from("troops").limit(api_keys.length*6);
          }

          if(troops.length <= 1)
          { 
            await Database.from("riayahs").where("id",campaign.id).update({status : "done"}); 
            return;
          }
          let api_id = 0;

          for await (const troop of troops) {
            
            await axios.post("http://api.dripsender.id/send",{
              api_key : api_keys[api_id].id,
              phone : troop.phone,
              text : campaign.text,
              type : "buttonsMessage",
              footerText : "Admin TS",
              buttons : campaign.buttons.split(',')
            })

            api_id++;

            if(api_id == api_keys.length)
            {
              api_id = 0;
            }
            
          }



          await Database.from("riayahs").where("id",campaign.id).update({troop_id : troops[troops.length-1].id}); 

        }else{
          const troop  = await Database.from("troops").orderBy("id","desc").first();

          if(troop)
          campaign.last_troop_id = troop.id;
        }
    }

  }
}
