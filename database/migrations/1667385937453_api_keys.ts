import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'api_keys'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique() 
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
