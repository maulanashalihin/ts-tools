import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique();
      table.text("text")
      table.text("buttons")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
