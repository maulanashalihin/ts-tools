import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'troops'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("phone").unique(); 
      table.string("tg_id").unique()
      table.integer("score").defaultTo(0);
      table.string("twitter_username"); 
      table.string("name"); 
      table.string("gender"); 
      table.bigInteger("last_active").index();  
      table.string("pin_hash")
      table.boolean("pin_set").defaultTo(false)
      table.boolean("blocked").defaultTo(false)
      table.string("city")  
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
