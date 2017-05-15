import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import PlatformAliases from './platformaliases';
import rateLimit from '../../modules/rate-limit.js';

// console.log('METHODS')

export const upsertDocument = new ValidatedMethod({
  name: 'platformaliases.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    name: { type: String, optional: false },
    profile: { type: String, optional: false },
  }).validator(),
  run(document) {
    document.owner = this.userId
    // console.log(document)
    return PlatformAliases.upsert({_id: document._id, owner: this.userId, name: document.name}, {$set: document});
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'platformaliases.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    // console.log('owner', this.userId)
    PlatformAliases.remove({_id: _id, owner: this.userId});
  },
});

rateLimit({
  methods: [
    upsertDocument,
    removeDocument,
  ],
  limit: 5,
  timeRange: 1000,
});
