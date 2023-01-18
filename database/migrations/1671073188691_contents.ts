import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text("caption")
      table.integer("channel_id").index()
      table.boolean("is_omoo").defaultTo(false).index()
      table.string("channel_name")
      table.string("channel_avatar")
      table.string("category").index()
      table.text("thumbnail")
      table.string("type")
      table.text("images_url")
      table.text("video_url") 
      table.integer("likes").defaultTo(0)
      table.integer("share").defaultTo(0)
      table.integer("point").defaultTo(0).index()
      table.string("status").defaultTo("pending").index();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.bigInteger("created").index()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
