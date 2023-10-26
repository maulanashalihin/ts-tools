import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tweets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text("content")
      table.bigInteger("created_at")
      table.integer("click_number")
      table.integer("campaign_id").index()
      table.string("status").defaultTo("on review").index()
      table.integer("published_by").index()
      table.boolean('daily_tweet').index().defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
