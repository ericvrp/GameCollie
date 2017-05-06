/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'meteor/practicalmeteor:chai';
import Files from './files.js';

describe('Files collection', function () {
  it('registers the collection with Mongo properly', function () {
    assert.equal(typeof Files, 'object');
  });
});
