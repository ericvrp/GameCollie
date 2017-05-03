/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'meteor/practicalmeteor:chai';
import Items from './items.js';

describe('Items collection', function () {
  it('registers the collection with Mongo properly', function () {
    assert.equal(typeof Items, 'object');
  });
});
