import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const DeviceProfiles = new Mongo.Collection('DeviceProfiles');
export default DeviceProfiles;

DeviceProfiles.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

DeviceProfiles.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

DeviceProfiles.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The owner of the device profile.',
  },
  name: {
    type: String,
    label: 'The name of the device profile.',
  },
  profile: {
      type: String,
      label: 'The actual device profile.',
    },
});

DeviceProfiles.attachSchema(DeviceProfiles.schema);

// XXX I don't know what the following lines would do
// Factory.define('deviceprofile', DeviceProfiles, {
//   profile: () => 'Factory JSON',
// });
