import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import ExportProfiles from '../../api/exportprofiles/exportprofiles';
import container from '../../modules/container';


const ExportProfilesList = ({ exportprofiles }) => (
  exportprofiles.length > 0 ? <ListGroup className="ExportProfilesList">
    {exportprofiles.map(({_id, owner, name, profile}) => (
      <ListGroupItem key={_id}>
        {name}
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No export profiles yet.</Alert>
);

ExportProfilesList.propTypes = {
  exportprofiles: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('exportprofiles.list');
  if (subscription.ready()) {
    const exportprofiles = ExportProfiles.find().fetch();
    onData(null, { exportprofiles });
  }
}, ExportProfilesList);
