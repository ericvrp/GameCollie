import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Alert } from 'react-bootstrap'; // https://react-bootstrap.github.io/components.html
import { Meteor } from 'meteor/meteor';
import ExportProfiles from '../../api/exportprofiles/exportprofiles';
import container from '../../modules/container';


const ExportProfilesSelect = ({ exportprofiles, name }) => (
  exportprofiles.length > 0 ? <select name={name || 'exportProfileName'}>
    {exportprofiles.map(({_id, owner, name, profile}) => (
      <option key={_id}>{name}</option>
    ))}
  </select> :
  <Alert bsStyle="warning">No export profiles yet.</Alert>
);

ExportProfilesSelect.propTypes = {
  exportprofiles: PropTypes.array,
  name: PropTypes.string,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('exportprofiles.list');
  if (subscription.ready()) {
    const exportprofiles = ExportProfiles.find().fetch();
    onData(null, { exportprofiles });
  }
}, ExportProfilesSelect);
