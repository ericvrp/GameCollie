import React from 'react';
import { Link } from 'react-router';
import Files from '../../api/files/files';

import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import container from '../../modules/container';

const fs     = require('fs')
const fsrp = require('fs.realpath')

export default class Ingest extends React.Component {
  componentDidMount() {
  }

  ingestFiles(event) {
    event.preventDefault();

    Meteor.call('files.ingesthashfile');
	}

	scrapeFiles(event) {
    event.preventDefault();

  	Meteor.call('files.scrapenewfiles');
	}

  render() {
    return (
      <div className="IngestFiles">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Import File</h4>
	          <Button type="submit" bsStyle="success" onClick={this.ingestFiles}>Ingest</Button>
	          <Button type="submit" bsStyle="success" onClick={this.scrapeFiles}>Scrape</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
