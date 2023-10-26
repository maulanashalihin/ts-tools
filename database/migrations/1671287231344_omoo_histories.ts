import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'omoo_histories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer("troop_id").index()
      table.string('notes')
      table.integer("content_id");
      table.string("content_type");
      table.bigInteger("created")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
