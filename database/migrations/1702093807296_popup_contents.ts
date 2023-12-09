import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contents'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('isPopup').defaultTo(false);
    });
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('popup');
    });
  }
}
