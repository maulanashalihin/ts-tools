import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'riayahs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text("text")
      table.integer("troop_id");
      table.integer("last_troop_id");
      table.text("buttons")
      table.text("file")
      table.text("filename")
      table.string("status").index();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
