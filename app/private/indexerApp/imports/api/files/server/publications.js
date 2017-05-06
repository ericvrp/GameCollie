import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Files from '../files';

Meteor.publish('files.list', () => Files.find());

Meteor.publish('files.view', (_id) => {
  check(_id, String);
  return Files.find(_id);
});
