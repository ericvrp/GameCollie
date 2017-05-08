import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';


// note: this file is called DesktopPage.js instead of Desktop.js because that would cause confusion with the global variable called Desktop provided by the meteor-desktop package

const timeout = 2000

// const fetchAll = () => {
//   Desktop.fetch('indexer', 'start', timeout, 'ping').then(result => console.log(result))
//   Desktop.fetch('indexer', 'start2', timeout, 'ping').then(result => console.log(result))
// }

export default class extends React.Component {
  startIndexer(event) {
    event.preventDefault();
    Desktop.fetch('indexer', 'getFile', timeout, '/Users/eric/Desktop/GameCollie.txt').then(result => console.log(result))

    // const t = 10
    // fetchAll()
    // setTimeout(fetchAll, t * 1)
    // setTimeout(fetchAll, t * 2)
    // setTimeout(fetchAll, t * 3)
    // setTimeout(fetchAll, t * 4)
	}

	startExporter(event) {
    event.preventDefault();
    Desktop.fetch('exporter', 'start', timeout, 'ping').then(result => console.log(result))
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
