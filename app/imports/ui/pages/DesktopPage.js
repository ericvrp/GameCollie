import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import ExportProfiles from '../../api/exportprofiles/exportprofiles';

const exportProfile = require('../../exporterSettings/casualProfile.json')


Meteor.subscribe('exportprofiles.list')
// const subscription = Meteor.subscribe('exportprofiles.list');
//     const exportprofiles = ExportProfiles.find().fetch();

const statusUpdateInterval = 1000
const timeout = 1000 * 60 * 60 // one hour


export default class extends React.Component {
  constructor() {
    super()

    this.state = {
      indexerStatus: '<idle>',
      indexerLastResult: '',

      exporterStatus: '<idle>',
      exporterLastResult: '',
    }

    setInterval(this.indexGamesCollectionGetUpdates.bind(this), statusUpdateInterval)
  }

  indexGamesCollectionGetUpdates() {
    Desktop.fetch('indexer', 'getResults', timeout)
      .then(results => {
        if (results.length === 0) return
        console.log(results)
        this.setState({indexerLastResult: results[results.length - 1].path})
      }
    )

    Desktop.fetch('indexer', 'getStatus', timeout)
      .then(status => this.setState({indexerStatus: status}))

    Desktop.fetch('exporter', 'getStatus', timeout)
      .then(status => this.setState({exporterStatus: status}))
  }

  indexGamesCollection(event) {
    event.preventDefault();

    const gameCollectionPath = document.querySelector('[name="gameCollectionPath"]').value.trim()
    Desktop.fetch('indexer', 'start', timeout, gameCollectionPath)
      .then()
	}

	exportToDevice(event) {
    event.preventDefault();

    const gameCollectionPath   = document.querySelector('[name="gameCollectionPath"]').value.trim()
    const deviceCollectionPath = document.querySelector('[name="deviceCollectionPath"]').value.trim()

    const exportLimit = {
      minRating: parseFloat(document.querySelector('[name="deviceLimitMinRating"]').value.trim()),
      maxGB    : parseInt(document.querySelector('[name="deviceLimitMaxGb"]').value.trim(), 10),
      maxGames : parseInt(document.querySelector('[name="deviceLimitMaxGames"]').value.trim(), 10)
    }

    Desktop.fetch('exporter', 'start', timeout, gameCollectionPath, deviceCollectionPath, exportProfile, exportLimit)
      .then()
	}

  render() {
    const defaultGameCollectionPath   = '/Users/eric/Downloads/testgames/collection'
    const defaultDeviceCollectionPath = '/Users/eric/Downloads/testgames/device'
    const defaultDeviceLimitMinRating = 0.3
    const defaultDeviceLimitMaxGb     = 32
    const defaultDeviceLimitMaxGames  = 99999

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
                {this.state.indexerStatus} {this.state.indexerLastResult}<br/>
                <Button type="submit" bsStyle="success" onClick={this.indexGamesCollection.bind(this)}>Index Games Collection</Button>
              </form>
            </p>

            <p>
              <form>
                <FormGroup>
                  <ControlLabel>Device collection</ControlLabel>
                  <FormControl type="text" name="deviceLimitMinRating" placeholder="minimum rating" defaultValue={defaultDeviceLimitMinRating} />
                  <FormControl type="text" name="deviceLimitMaxGb"     placeholder="max Gb"         defaultValue={defaultDeviceLimitMaxGb    } />
                  <FormControl type="text" name="deviceLimitMaxGames"  placeholder="max games"      defaultValue={defaultDeviceLimitMaxGames } />
                  <FormControl type="text" name="deviceCollectionPath" placeholder="path"           defaultValue={defaultDeviceCollectionPath} />
                </FormGroup>
                {this.state.exporterStatus} {this.state.exporterLastResult}<br/>
                <Button type="submit" bsStyle="success" onClick={this.exportToDevice.bind(this)}>Export to Device</Button>
              </form>
            </p>

          </Col>
        </Row>
      </div>
    );
  }
}
