import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

const ExportProfiles = new Mongo.Collection('ExportProfiles');
export default ExportProfiles;

ExportProfiles.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

ExportProfiles.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

ExportProfiles.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The owner of the export profile.',
  },
  name: {
    type: String,
    label: 'The name of the export profile.',
  },
  profile: {
      type: String,
      label: 'The actual export profile.',
    },
});

ExportProfiles.attachSchema(ExportProfiles.schema);

// XXX I don't know what the following lines would do
// Factory.define('exportprofile', ExportProfiles, {
//   profile: () => 'Factory JSON',
// });
