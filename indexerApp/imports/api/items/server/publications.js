import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Items from '../items';

Meteor.publish('items.list', () => Items.find());

Meteor.publish('items.view', (_id) => {
  check(_id, String);
  return Items.find(_id);
});
