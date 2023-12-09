import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contents'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('isPopup').defaultTo(false);
      table.integer('PopUpCount').defaultTo(0);
    });
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('isPopup');
      table.dropColumn('PopUpCount');
    });
  }
}
