import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Files from './files';
// import rateLimit from '../../modules/rate-limit.js';

export const upsertFile = new ValidatedMethod({
  name: 'files.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    path: { type: String, optional: true },
    hash_sha256: { type: String, optional: true },
    hash_md5: { type: String, optional: true },
    hash_crc32: { type: String, optional: true },
  }).validator(),
  run(file) {
    return Files.upsert({ _id: file._id }, { $set: file });
  },
});

export const removeFile = new ValidatedMethod({
  name: 'files.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Files.remove(_id);
  },
});

// rateLimit({
//   methods: [
//     upsertFile,
//     removeFile,
//   ],
//   limit: 5,
//   timeRange: 1000,
// });
