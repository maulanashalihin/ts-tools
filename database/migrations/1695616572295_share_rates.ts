import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'share_rates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("date").index()
      table.string("city").index();
      table.integer("troop_id").index();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
