import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import DeviceProfiles from './deviceprofiles';
import rateLimit from '../../modules/rate-limit.js';

export const upsertDocument = new ValidatedMethod({
  name: 'deviceprofiles.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    name: { type: String, optional: false },
    profile: { type: String, optional: false },
  }).validator(),
  run(document) {
    document.owner = this.userId
    // console.log(document)
    return DeviceProfiles.upsert({_id: document._id, owner: this.userId, name: document.name}, {$set: document});
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'deviceprofiles.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    // console.log('owner', this.userId)
    DeviceProfiles.remove({_id: _id, owner: this.userId});
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
