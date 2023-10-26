import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("name")
      table.text("avatar")
      table.integer("authority_point").defaultTo(0)
      table.integer("likes").defaultTo(0)
      table.boolean("official").defaultTo(false);
      table.string("tiktok_url")
      table.string("website_url")
      table.string("facebook_url")
      table.string("youtube_url")
      table.string("ig_url")
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
