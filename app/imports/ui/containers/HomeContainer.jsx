import React from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import Home from '../components/Home';

export default createContainer(() => {
  return {
    // some reactive Meteor data here
  };
}, Home);
