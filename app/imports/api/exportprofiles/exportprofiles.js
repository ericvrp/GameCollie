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
  json: {
    type: String,
    label: 'The content of the export profile.',
  },
});

ExportProfiles.attachSchema(ExportProfiles.schema);

Factory.define('exportprofile', ExportProfiles, {
  title: () => 'Factory Title',
  body: () => 'Factory Body',
});
