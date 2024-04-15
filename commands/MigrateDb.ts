import { BaseCommand } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database' 
export default class MigrateDb extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'migrate:db'

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

 

    const headers = ["omoo_histories","open_rates","share_rates"];

    for await (const table of headers) {
      let latest_id = 0;
      let total  = await Database.connection("mysql").from(table).count("* as total").first();

      if(total && total.total > 0)
      {
        let data;

        if(latest_id = 0)
        {
          data = await Database.connection("mysql").from(table).limit(1000);
        }
        else {
          data = await Database.connection("mysql").from(table).where("id",">",latest_id).limit(1000);
        }

        console.log(data.length)
        
        for await (const row of data) {
          await Database.table(table).insert(row);
          latest_id = row.id;
        }
      }
      
     
      console.log("done migrate "+table+" table");
    }
    
  }
}
