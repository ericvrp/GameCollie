/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import ExportProfiles from './exportprofiles.js';
import { upsertExportProfile, removeExportProfile } from './methods.js';

describe('ExportProfiles methods', function () {
  beforeEach(function () {
    if (Meteor.isServer) {
      resetDatabase();
    }
  });

  it('inserts an export profile into the ExportProfiles collection', function () {
    upsertExportProfile.call({
      title: 'You can\'t arrest me, I\'m the Cake Boss!',
      body: 'They went nuts!',
    });

    const getExportProfile = ExportProfiles.findOne({ title: 'You can\'t arrest me, I\'m the Cake Boss!' });
    assert.equal(getExportProfile.body, 'They went nuts!');
  });

  it('updates an export profile in the ExportProfiles collection', function () {
    const { _id } = Factory.create('exportprofile');

    upsertExportProfile.call({
      _id,
      title: 'You can\'t arrest me, I\'m the Cake Boss!',
      body: 'They went nuts!',
    });

    const getExportProfile = ExportProfiles.findOne(_id);
    assert.equal(getExportProfile.title, 'You can\'t arrest me, I\'m the Cake Boss!');
  });

  it('removes an export profile from the ExportProfiles collection', function () {
    const { _id } = Factory.create('exportprofile');
    removeExportProfile.call({ _id });
    const getExportProfile = ExportProfiles.findOne(_id);
    assert.equal(getExportProfile, undefined);
  });
});
