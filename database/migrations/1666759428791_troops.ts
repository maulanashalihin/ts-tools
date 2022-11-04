import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'troops'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("phone").unique(); 
      table.integer("score").defaultTo(0);
      table.string("twitter_username"); 
      table.bigInteger("last_active");  
      table.string("city") 
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
