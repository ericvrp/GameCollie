import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import DeviceProfiles from '../deviceprofiles';

Meteor.publish('deviceprofiles.list', () => DeviceProfiles.find());

Meteor.publish('deviceprofiles.view', (_id) => {
  check(_id, String);
  return DeviceProfiles.find(_id); // TODO: restrict by public (no owner) or owner===this.userId
});
