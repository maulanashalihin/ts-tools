import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tweet_to_buzzes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("tweet_id")
      table.text("text");
      table.string("screen_name")
      table.string("name")
      table.integer("click_number")
      table.integer("campaign_id").index()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
