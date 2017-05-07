import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Jumbotron } from 'react-bootstrap';

const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>GameCollie</h2>
      <p>GameCollie keeps track of all your game collection needs</p>
      {Meteor.isDesktop && <p>(desktop version)</p>}
    </Jumbotron>
  </div>
);

export default Index;
