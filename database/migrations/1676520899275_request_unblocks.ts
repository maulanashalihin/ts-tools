import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_unblocks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') 
      table.string("name")
      table.string("phone")
      table.string("tg_id")
      table.text("reason")
      table.string("status").defaultTo("pending").index()
      table.text("rejected_reason")
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string("created_at")
      table.string("updated_at")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
