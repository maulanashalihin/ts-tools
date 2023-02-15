import { BaseCommand } from '@adonisjs/core/build/standalone'

import Redis from "@ioc:Adonis/Addons/Redis";
import Database from "@ioc:Adonis/Lucid/Database";
import {v4} from "uuid"
import bot from "App/Services/Bot"
import Application from '@ioc:Adonis/Core/Application'
import fs from "fs"


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
                troop.id = await Database.table("troops").insert(troop);
            } else{
                if(troop.blocked)
                {
                    bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir.");

                    return;
                }
            }

            const ott = v4(); 

            await Redis.setex(`token:`+ott,600,troop.id);

            bot.sendMessage(chatId, "Silakan gunakan token berikut `"+ott+"`   untuk login ke dalam Aplikasi \n\nPS : klik pada token untuk copy text",{parse_mode : "MarkDown"});


          
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
                    bot.sendMessage(chatId, "Maaf, Akun anda telah diblokir.");
        
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
 
      setInterval(async ()=>{
        
        for(let i=0;i<10;i++)
        {
          const data_ = await Redis.spop("queue:riayah")
          
          if(data_)
          {
            const data = JSON.parse(data_)

            if(data.file)
            { 
              const stream = fs.createReadStream(Application.tmpPath('uploads')+"/"+data.file); 
              
              bot.sendPhoto(data.tg_id,stream,{caption : data.text} );

            }else{
              bot.sendMessage(data.tg_id, data.text);
            }
            
  
          }
         

        }

      },1000)
  }
}
