import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Items from '../../api/items/items';
import container from '../../modules/container';

const handleNav = _id => browserHistory.push(`/items/${_id}`);

const ItemsList = ({ items }) => (
  items.length > 0 ? <ListGroup className="ItemsList">
    {items.map(({ _id, title }) => (
      <ListGroupItem key={ _id } onClick={ () => handleNav(_id) }>
        { title }
      </ListGroupItem>
    ))}
  </ListGroup> :
  <Alert bsStyle="warning">No items yet.</Alert>
);

ItemsList.propTypes = {
  items: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('items.list');
  if (subscription.ready()) {
    const items = Items.find().fetch();
    onData(null, { items });
  }
}, ItemsList);
