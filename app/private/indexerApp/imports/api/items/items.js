import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const Items = new Mongo.Collection('Items');
export default Items;

Items.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Items.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Items.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'The title of the item.',
  },
  // body: {
  //   type: String,
  //   label: 'The body of the item.',
  // },
});

Items.attachSchema(Items.schema);

Factory.define('item', Items, {
  title: () => 'Factory Title',
  // body: () => 'Factory Body',
});
