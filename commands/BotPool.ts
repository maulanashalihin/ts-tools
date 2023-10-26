import { BaseCommand } from '@adonisjs/core/build/standalone'

import Redis from "@ioc:Adonis/Addons/Redis";
import Database from "@ioc:Adonis/Lucid/Database";
import {v4} from "uuid"
import bot from "App/Services/Bot" 

export default class BotPool extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'bot:pool'

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
    stayAlive: true,
  }

  public async run() {
    
      bot.on('message',async (msg) => {
        const chatId = msg.chat.id;

      
        if(msg.text == "/help" )
        {
            

            bot.sendMessage(chatId,  `Beberapa perintah yang bisa dilakukan untuk bot :
            
      /login - untuk mendapatkan token
      /check_id - untuk mendapatkan user_id anda
      /delete_akun - untuk menghapus akun

      Terima kasih.`);


          
        } else if(msg.text == "LOGIN OMOO" || msg.text == "LOGIN TS" || msg.text == "/login" )
        {
            let troop = await Database.from("troops").where("tg_id",chatId).first();

            if(!troop)
            {
                troop = {
                    tg_id : chatId,
                    name : msg.chat.first_name
                }
              try {
                  troop.id = await Database.table("troops").insert(troop);
              } catch (error) {
                
              }
            } else{
                if(troop.blocked)
                {
                  bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
        
                    return;
                }
            }

            const ott = v4(); 

            await Redis.setex(`token:`+ott,600,troop.id);

            bot.sendMessage(chatId, "Silakan gunakan token di bawah ini  untuk login ke dalam Aplikasi. klik pada token untuk copy text");

            setTimeout(()=>{
              bot.sendMessage(chatId, "`"+ott+"`",{parse_mode : "MarkDown"});
            },100)


          
        }else if(msg.text == "CHECK ID" || msg.text == "/check_id")
        {
          
            bot.sendMessage(chatId, "ID anda adalah `"+chatId+"`",{parse_mode : "MarkDown"});


          
        }else if(msg.text == "DELETE AKUN" || msg.text == "/delete_akun")
        {
            

            let troop = await Database.from("troops").where("tg_id",chatId).first();
            if(troop)
            {
                if(troop.blocked)
                {
                    bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir. \n\nAnda bisa melakukan pengajuan cabut blokir disini https://ts.belanabi.com/request-unblock");
        
                    return;
                }
                
                await Database.from("troops").where("tg_id",chatId).delete()
            }
          

            bot.sendMessage(chatId, "ID `"+chatId+"` telah dihapus",{parse_mode : "MarkDown"});


          
        }else{
            bot.sendMessage(chatId, "Selamat datang di BOT OMOO. /help", {
            "reply_markup": {
                "keyboard": [["LOGIN OMOO","LOGIN TS"],["CHECK ID","DELETE AKUN"]]
                }
            });
        }
      
      });

      console.log("bot pool is running")
 
      
  }
}
