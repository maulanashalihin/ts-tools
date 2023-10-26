import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'medias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("tweet_id")
      table.string("media_url") //media_url_https
      table.string("twitter_url") //url
      table.string("type");
      table.integer("campaign_id").index()

      // https://api.twitter.com/1.1/statuses/show.json?id=1585890866790817793&include_entities=true&tweet_mode=extended

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
