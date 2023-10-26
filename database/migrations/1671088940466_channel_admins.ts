import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'channel_admins'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer("channel_id").index()
      table.integer("troop_id").index()
      table.unique(['channel_id','troop_id'])
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
    
  }
}
