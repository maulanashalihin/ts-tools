import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User' 


export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.create(
      {
        name : "Maulana",
        email : "maulanashalihin@gmail.com",
        password : "i5lamoke"
      }
    )
  }
}
