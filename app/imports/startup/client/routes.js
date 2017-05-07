/* eslint-disable max-len */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.js';
import Documents from '../../ui/pages/Documents.js';
import Files from '../../ui/pages/Files.js';
import Items from '../../ui/pages/Items.js';
import Ingest from '../../ui/pages/Ingest.js';
import Desktop from '../../ui/pages/Desktop.js';
// import NewDocument from '../../ui/pages/NewDocument.js';
// import EditDocument from '../../ui/pages/EditDocument.js';
// import ViewDocument from '../../ui/pages/ViewDocument.js';
import NewItem from '../../ui/pages/NewItem.js';
import EditItem from '../../ui/pages/EditItem.js';
import ViewItem from '../../ui/pages/ViewItem.js';
import Index from '../../ui/pages/Index.js';
import Login from '../../ui/pages/Login.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';

const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } />
        <Route name="files" path="/files" component={ Files } onEnter={ authenticate } />
        <Route name="items" path="/items" component={ Items } onEnter={ authenticate } />
        <Route name="newItem" path="/items/new" component={ NewItem } onEnter={ authenticate } />
        <Route name="editItem" path="/items/:_id/edit" component={ EditItem } onEnter={ authenticate } />
        <Route name="viewItem" path="/items/:_id" component={ ViewItem } onEnter={ authenticate } />
        <Route name="ingest" path="/ingest" component={ Ingest } onEnter={ authenticate } />
        <Route name="desktop" path="/desktop" component={ Desktop } onEnter={ authenticate } />
        <Route name="login" path="/login" component={ Login } />
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
        <Route name="signup" path="/signup" component={ Signup } />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root'),
  );
});

        // <Route name="documents" path="/documents" component={ Documents } onEnter={ authenticate } />
        // <Route name="newDocument" path="/documents/new" component={ NewDocument } onEnter={ authenticate } />
        // <Route name="editDocument" path="/documents/:_id/edit" component={ EditDocument } onEnter={ authenticate } />
        // <Route name="viewDocument" path="/documents/:_id" component={ ViewDocument } onEnter={ authenticate } />
