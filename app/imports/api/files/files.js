import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Files = new Mongo.Collection('Files');
export default Files;

Files.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Files.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Files.schema = new SimpleSchema({
  path: {
    type: String,
    label: 'full disk path',
  },
  hash_sha256: {
    type: String,
    label: 'sha256 for this file',
  },
  hash_md5: {
    type: String,
    label: 'sha256 for this file',
  },
  hash_crc32: {
    type: String,
    label: 'sha256 for this file',
  },
});

Files.attachSchema(Files.schema);

