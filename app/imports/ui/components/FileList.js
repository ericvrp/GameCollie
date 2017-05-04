import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Files from '../../api/files/files';
import container from '../../modules/container';

const handleNav = _id => browserHistory.push(`/files/${_id}`);

const FileList = ({ files }) => (
  files.length > 0 ? <ListGroup className="FileList">
    {files.map(({ _id, path }) => (
      <ListGroupItem key={ _id } onClick={ () => handleNav(_id) }>
        { path }
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No files yet.</Alert>
);

FileList.propTypes = {
  files: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('files.list');
  if (subscription.ready()) {
    const files = Files.find().fetch();
    onData(null, { files });
  }
}, FileList);
