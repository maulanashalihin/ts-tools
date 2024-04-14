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

 

    const headers = ["users","campaigns","troops","tweets","medias","tweet_to_buzzes","campaign_attendances","api_keys","messages","riayahs","channels","contents","channel_admins","api_tokens","bank_tsaqofahs","strat_plans","request_unblocks","open_rates","share_rates","search_rates","popup_contents"];

    for await (const table of headers) {
      const data = await Database.connection("mysql").from(table);
      for await (const row of data) {
        await Database.table(table).insert(row);
      }
     
      console.log("done migrate "+table+" table");
    }
    
  }
}
