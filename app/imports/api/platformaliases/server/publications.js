import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import PlatformAliases from '../platformaliases';

// console.log('PUBLISH')
Meteor.publish('platformaliases.list', () => PlatformAliases.find());

Meteor.publish('platformaliases.view', (_id) => {
  check(_id, String);
  return PlatformAliases.find(_id); // TODO: restrict by public (no owner) or owner===this.userId
});
