import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
const exportProfile = require('../../exporterSettings/casualProfile.json')
// console.log(exportProfile)
const exportLimit = require('../../exporterSettings/32GbLimit.json')
// console.log(exportLimit)


const timeout = 1000 * 60 * 60 // one hour
let   indexerStarted = false


export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      indexerStatus: '',
      exporterStatus: ''
    }
  }

  indexGamesCollectionGetUpdates() {
    if (!indexerStarted) return

    // const _this = this
    Desktop.fetch('indexer', 'getNewHashResults', timeout)
      .then(hashResults => {
        if (hashResults.length === 0) return
        console.log(hashResults)
        this.setState({indexerStatus: hashResults[hashResults.length - 1].path})
      }
    )
  }

  indexGamesCollection(event) {
    event.preventDefault();

    if (indexerStarted) {
      console.info('Not starting the indexer more then once!')
      return
    }

    const gameCollectionPath = document.querySelector('[name="gameCollectionPath"]').value.trim()
    Desktop.fetch('indexer', 'run', timeout, gameCollectionPath)
      .then(result => this.setState({indexerStatus: result}))

    setInterval(this.indexGamesCollectionGetUpdates.bind(this), 500) // or once in constructor
    indexerStarted = true
	}

	exportToDevice(event) {
    event.preventDefault();

    const gameCollectionPath   = document.querySelector('[name="gameCollectionPath"]').value.trim()
    const deviceCollectionPath = document.querySelector('[name="deviceCollectionPath"]').value.trim()
    Desktop.fetch('exporter', 'run', timeout, gameCollectionPath, deviceCollectionPath, exportProfile, exportLimit)
      .then(result => this.setState({exporterStatus: result}))
	}

  render() {
    const defaultGameCollectionPath   = '/Users/eric/Downloads/testgames/collection'
    const defaultDeviceCollectionPath = '/Users/eric/Downloads/testgames/device'

    return (
      <div className="Desktop">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Desktop features</h4>

            <p>
              <form>
                <FormGroup>
                  <ControlLabel>Game collection</ControlLabel>
                  <FormControl type="text" name="gameCollectionPath" placeholder="path" defaultValue={defaultGameCollectionPath} />
                </FormGroup>
                {this.state.indexerStatus}<br/>
                <Button type="submit" bsStyle="success" onClick={this.indexGamesCollection.bind(this)}>Index Games Collection</Button>
              </form>
            </p>

            <p>
              <form>
                <FormGroup>
                  <ControlLabel>Device collection</ControlLabel>
                  <FormControl type="text" name="deviceCollectionPath" placeholder="path" defaultValue={defaultDeviceCollectionPath} />
                </FormGroup>
                {this.state.exporterStatus}<br/>
                <Button type="submit" bsStyle="success" onClick={this.exportToDevice.bind(this)}>Export to Device</Button>
              </form>
            </p>

          </Col>
        </Row>
      </div>
    );
  }
}
