import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Items from '../../api/items/items';
import ItemEditor from '../components/ItemEditor';
import NotFound from './NotFound';
import container from '../../modules/container';

const EditItem = ({ doc }) => (doc ? (
  <div className="EditItem">
    <h4 className="page-header">Editing "{ doc.title }"</h4>
    <ItemEditor doc={ doc }/>
  </div>
) : <NotFound />);

EditItem.propTypes = {
  doc: PropTypes.object,
};

export default container((props, onData) => {
  const itemId = props.params._id;
  const subscription = Meteor.subscribe('items.view', itemId);

  if (subscription.ready()) {
    const doc = Items.findOne(itemId);
    onData(null, { doc });
  }
}, EditItem);
