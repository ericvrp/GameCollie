/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import Files from './files.js';
import { upsertFile, removeFile } from './methods.js';

describe('Files methods', function () {
  beforeEach(function () {
    if (Meteor.isServer) {
      resetDatabase();
    }
  });

  // Todo fill test cases with 'real' data

  // it('inserts a file into the Files collection', function () {
  //   upsertFile.call({
  //     title: 'You can\'t arrest me, I\'m the Cake Boss!',
  //     body: 'They went nuts!',
  //   });

  //   const getFile = Files.findOne({ title: 'You can\'t arrest me, I\'m the Cake Boss!' });
  //   assert.equal(getFile.body, 'They went nuts!');
  // });

  // it('updates a file in the Files collection', function () {
  //   const { _id } = Factory.create('file');

  //   upsertFile.call({
  //     _id,
  //     title: 'You can\'t arrest me, I\'m the Cake Boss!',
  //     body: 'They went nuts!',
  //   });

  //   const getFile = Files.findOne(_id);
  //   assert.equal(getFile.title, 'You can\'t arrest me, I\'m the Cake Boss!');
  // });

  // it('removes a file from the Files collection', function () {
  //   const { _id } = Factory.create('file');
  //   removeFile.call({ _id });
  //   const getFile = Files.findOne(_id);
  //   assert.equal(getFile, undefined);
  // });
});
