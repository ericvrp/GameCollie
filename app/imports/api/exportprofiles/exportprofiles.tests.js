/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'meteor/practicalmeteor:chai';
import ExportProfiles from './exportprofiles.js';

describe('ExportProfiles collection', function () {
  it('registers the export profile with Mongo properly', function () {
    assert.equal(typeof ExportProfiles, 'object');
  });
});
