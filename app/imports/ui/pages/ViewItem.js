import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Items from '../../api/items/items';
import { removeItem } from '../../api/items/methods';
import NotFound from './NotFound';
import container from '../../modules/container';

const handleEdit = (_id) => {
  browserHistory.push(`/items/${_id}/edit`);
};

const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
    removeItem.call({ _id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Item deleted!', 'success');
        browserHistory.push('/items');
      }
    });
  }
};

const ViewItem = ({ item }) => {
  return item ? (
    <div className="ViewItem">
      <div className="page-header clearfix">
        <h4 className="pull-left">{ item && item.title }</h4>
        <ButtonToolbar className="pull-right">
          <ButtonGroup bsSize="small">
            <Button onClick={ () => handleEdit(item._id) }>Edit</Button>
            <Button onClick={ () => handleRemove(item._id) } className="text-danger">Delete</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      LATER SOME INFO ABOUT THIS ITEM WILL BE ADDED!!!
    </div>
  ) : <NotFound />;
};
//      { item && item.body }


ViewItem.propTypes = {
  item: PropTypes.object,
};

export default container((props, onData) => {
  const itemId = props.params._id;
  const subscription = Meteor.subscribe('items.view', itemId);

  if (subscription.ready()) {
    const item = Items.findOne(itemId);
    onData(null, { item });
  }
}, ViewItem);
