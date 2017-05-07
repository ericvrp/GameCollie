import React from 'react';
import { Link } from 'react-router';

import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';


export default class Desktop extends React.Component {
  startIndexer(event) {
    event.preventDefault();
    alert('TODO: Indexer')
	}

	startExporter(event) {
    event.preventDefault();
    alert('TODO: Exporter')
	}

  render() {
    return (
      <div className="Desktop">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Desktop features</h4>
	          <Button type="submit" bsStyle="success" onClick={this.startIndexer}>Indexer</Button>
	          <Button type="submit" bsStyle="success" onClick={this.startExporter}>Exporter</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
