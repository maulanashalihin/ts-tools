import { BaseCommand } from "@adonisjs/core/build/standalone"; 
const TeleBot = require("telebot"); 

import Env from "@ioc:Adonis/Core/Env";
import Bot from "App/Services/Bot";

export default class Telebot1 extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = "telebot1";

  /**
   * Command description is displayed in the "help" output
   */
  public static description = "";

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
    stayAlive: true,
  };

  public async run() {
    const TG_BOTKEY = Env.get(
      "TG_BOTKEY",
      "5956181108:AAHzvP-hAqqI9TY9bwxuQnDclkW80Njl0Wk"
    );

    let bot;

    if (process.env.TG_PORT && process.env.TG_WEBHOOK_URL) {
      bot = new TeleBot({
        token: TG_BOTKEY,
        webhook: {
          // Optional. Use webhook instead of polling.
          url: process.env.TG_WEBHOOK_URL, // HTTPS url to send updates to.
          host: "0.0.0.0", // Webhook server host.
          port: process.env.TG_PORT, // Server port.
        },
      });
    } else {
      console.log(TG_BOTKEY)
      bot = new TeleBot(TG_BOTKEY);
      console.log("bot started")
    }

    new Bot(bot);


  }
}
