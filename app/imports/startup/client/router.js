import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';

import MainLayout from '../../ui/layouts/MainLayout';

import HomeContainer from '../../ui/containers/HomeContainer';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(MainLayout, {
      content: <HomeContainer />
    });
  }
});
