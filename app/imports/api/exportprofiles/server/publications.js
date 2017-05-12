import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import ExportProfiles from '../exportprofiles';

Meteor.publish('exportprofiles.list', () => ExportProfiles.find());

Meteor.publish('exportprofiles.view', (_id) => {
  check(_id, String);
  return ExportProfiles.find(_id); // TODO: restrict by public (no owner) or owner===this.userId
});
