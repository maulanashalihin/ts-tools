import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    
    await Database.table("messages").insert({
      id : "join",
      text : `
Alhamdulillah, anda telah bergabung dalam campaign [title]

Campaign akan mulai pada [time]

Semoga Allah SWT membalas amal dan kebaikan kita. Trending Yuk! Gasken!
      `
    })

    await Database.table("messages").insert({
      id : "next_round_reminder",
      text : `
Saat ini round [current_round] telah dimulai

Yuk kembali masuk aplikasi dan melakukan ACTION yang sudah diakadkan.
`
    })

    
  }
}
