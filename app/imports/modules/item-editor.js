/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertItem } from '../api/items/methods.js';
import './validation.js';

let component;

const handleUpsert = () => {
  const { item } = component.props;
  const confirmation = item && item._id ? 'Item updated!' : 'Item added!';
  const upsert = {
    title: document.querySelector('[name="title"]').value.trim(),
    // body: item.querySelector('[name="body"]').value.trim(),
  };

  if (item && item._id) upsert._id = item._id;

  upsertItem.call(upsert, (error, response) => {
    if (error) {
      console.log('Bert is boos!!!!!' + JSON.stringify(error,0,4))
      Bert.alert(error.reason, 'danger');
    } else {
      component.itemEditorForm.reset();
      Bert.alert(confirmation, 'success');
      browserHistory.push(`/items/${response.insertedId || item._id}`);
    }
  });
};

const validate = () => {
  $(component.itemEditorForm).validate({
    rules: {
      title: {
        required: true,
      },
      // body: {
      //   required: true,
      // },
    },
    messages: {
      title: {
        required: 'Need a title in here, Seuss.',
      },
      // body: {
      //   required: 'This thneeds a body, please.',
      // },
    },
    submitHandler() { handleUpsert(); },
  });
};

export default function itemEditor(options) {
  component = options.component;
  validate();
}
