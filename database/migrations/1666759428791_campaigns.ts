import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'campaigns'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("title") 
      table.text("description")
      table.string("status").defaultTo("tweet submission")
      table.string("hashtags")
      table.integer("hashtag_per_tweet").defaultTo(1)
      table.bigInteger("time")
      table.string("campaign_time")
      table.string("slug").unique()
     
      table.integer("attendee").defaultTo(0)
      table.integer("follow_profile_per_round").defaultTo(5)
      table.integer("tweet_per_round").defaultTo(5)
      table.integer("tweet_love_and_retweet_per_round").defaultTo(5)
      table.integer("tweet_reply_per_round").defaultTo(5)

      table.text("report")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
