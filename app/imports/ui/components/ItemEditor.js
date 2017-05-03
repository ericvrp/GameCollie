/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import itemEditor from '../../modules/item-editor.js';

export default class ItemEditor extends React.Component {
  componentDidMount() {
    itemEditor({ component: this });
    setTimeout(() => { item.querySelector('[name="title"]').focus(); }, 0);
  }

  render() {
    const { item } = this.props;
    return (<form
      ref={ form => (this.itemEditorForm = form) }
      onSubmit={ event => event.preventDefault() }
    >
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <FormControl
          type="text"
          name="title"
          defaultValue={ item && item.title }
          placeholder="Name of a fantastic game!"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        { item && item._id ? 'Save Changes' : 'Add Item' }
      </Button>
    </form>);
  }
}

ItemEditor.propTypes = {
  item: PropTypes.object,
};

      // <FormGroup>
      //   <ControlLabel>Body</ControlLabel>
      //   <FormControl
      //     componentClass="textarea"
      //     name="body"
      //     defaultValue={ item && item.body }
      //     placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
      //   />
      // </FormGroup>

