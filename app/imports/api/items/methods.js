import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Items from './items';
import rateLimit from '../../modules/rate-limit.js';


export const upsertItem = new ValidatedMethod({
  name: 'item.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    title: { type: String, optional: true },
//    body: { type: String, optional: true },
  }).validator(),
  run(item) {
    return Item.upsert({ _id: item._id }, { $set: item });
  },
});

export const removeItem = new ValidatedMethod({
  name: 'item.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Item.remove(_id);
  },
});

rateLimit({
  methods: [
    upsertItem,
    removeItem,
  ],
  limit: 5,
  timeRange: 1000,
});
