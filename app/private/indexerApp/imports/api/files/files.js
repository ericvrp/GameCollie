import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

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

Factory.define('file', Files, {
  path: () => 'Factory Path',
  hash_sha256: () => 'Factory Hash SHA256',
  hash_md5: () => 'Factory Hash MD5',
  hash_crc32: () => 'Factory Hash CRC32',
});
