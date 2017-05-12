import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import ExportProfiles from './exportprofiles';
import rateLimit from '../../modules/rate-limit.js';

export const upsertDocument = new ValidatedMethod({
  name: 'exportprofiles.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    name: { type: String, optional: false },
    profile: { type: String, optional: false },
  }).validator(),
  run(document) {
    document.owner = this.userId
    // console.log(document)
    return ExportProfiles.upsert({_id: document._id, owner: this.userId, name: document.name}, {$set: document});
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'exportprofiles.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    // console.log('owner', this.userId)
    ExportProfiles.remove({_id: _id, owner: this.userId});
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
