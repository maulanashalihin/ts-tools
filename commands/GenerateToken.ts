import { BaseCommand } from '@adonisjs/core/build/standalone'
import Redis from '@ioc:Adonis/Addons/Redis'
import Database from '@ioc:Adonis/Lucid/Database'
import {v4} from "uuid"

export default class GenerateToken extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'generate:token'

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

    const ott = v4(); 

    let troop = await Database.from("troops").first();

    if(!troop)
    {
        troop = {
            tg_id : "796509100",
            name : "Maulana Shalihin"
        }
      try {
          troop.id = await Database.table("troops").insert(troop);
      } catch (error) {
        
      }
    }

    console.log(troop)

    await Redis.setex(`token:`+ott,600,troop.id);

    console.log(ott)
 
  }
}
 

