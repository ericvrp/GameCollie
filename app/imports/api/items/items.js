import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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

export const ItemInfoSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'The title of the item.',
  },
  cover: {
    type: String,
    label: 'The cover image of the item.',
  },
  description: {
    type: String,
    label: 'The description of the item.',
  },
});

export const ItemDataSourceSchema = new SimpleSchema({
  'name': {
    type: String,
    label: "Datasource name",
    defaultValue: 'available'
  },
  'id': {
    type: String,
    label: "ID",
    defaultValue: ''
  },
  // 'lastretrieved': {
  //   type: String,
  //   label: "Last Retrieved Date",
  //   defaultValue: ''
  // },
});

Items.schema = new SimpleSchema({
  info: {
    type: ItemInfoSchema,
  },
  datasources: {
    type: ItemDataSourceSchema,
  },
});

Items.attachSchema(Items.schema);
