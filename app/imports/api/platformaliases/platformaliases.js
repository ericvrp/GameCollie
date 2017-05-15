import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

// console.log('NEW COLLECTION')

const PlatformAliases = new Mongo.Collection('PlatformAliases');
export default PlatformAliases;

PlatformAliases.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PlatformAliases.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PlatformAliases.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The owner of the platform alias.',
  },
  name: {
    type: String,
    label: 'The name of the platform alias.',
  },
  profile: {
      type: String,
      label: 'The actual platform alias.',
    },
});

PlatformAliases.attachSchema(PlatformAliases.schema);

// XXX I don't know what the following lines would do
// Factory.define('platformaliases', PlatformAliases, {
//   profile: () => 'Factory JSON',
// });
