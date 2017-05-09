import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';


// note: this file is called DesktopPage.js instead of Desktop.js because that would cause confusion with the global variable called Desktop provided by the meteor-desktop package

// Desktop.fetch('indexer', 'getFile', timeout, '/Users/eric/Desktop/GameCollie.txt').then(result => console.log(result))

const timeout = 1000 * 60 * 60 // one hour
let   indexerStarted = false


export default class extends React.Component {
  testMeteorDesktop() {
    Desktop.fetch('indexer', 'test', timeout, 'ping').then(result => console.log(result))
    Desktop.fetch('indexer', 'test', timeout, 'ping').then(result => console.log(result))
    Desktop.fetch('indexer', 'test', timeout, 'ping').then(result => console.log(result))
    Desktop.fetch('indexer', 'test', timeout, 'ping').then(result => console.log(result))
    Desktop.fetch('indexer', 'test', timeout, 'ping').then(result => console.log(result))
  }

  indexGamesCollectionGetUpdates() {
    if (!indexerStarted) return
    // console.log('WIP: indexGamesCollectionGetUpdates')
    Desktop.fetch('indexer', 'getNewHashResults', timeout).then(hashResults => {
      if (hashResults.length === 0) return
      console.log(hashResults)
    })
  }

  indexGamesCollection(event) {
    event.preventDefault();

    if (indexerStarted) {
      console.info('Not starting the indexer more then once!')
      return
    }

    const gameCollectionPath = document.querySelector('[name="gameCollectionPath"]').value.trim()
    Desktop.fetch('indexer', 'run', timeout, gameCollectionPath).then(result => {/*console.log(result)*/})
    setInterval(this.indexGamesCollectionGetUpdates, 500) // or once in constructor
    indexerStarted = true
	}

	exportToDevice(event) {
    event.preventDefault();
    console.log('todo')
    // Desktop.fetch('exporter', 'start', timeout, 'ping').then(result => console.log(result))
	}

  render() {
    const defaultPath = '/Users/eric/odrive/Stack2/RetroGames/testgames/src'

    return (
      <div className="Desktop">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Desktop features</h4>

            <p>
              <form>
                <FormGroup>
                  <ControlLabel>Game collection</ControlLabel>
                  <FormControl type="text" name="gameCollectionPath" placeholder="path" defaultValue={defaultPath} />
                </FormGroup>
                <Button type="submit" bsStyle="success" onClick={this.indexGamesCollection.bind(this)}>Index Games Collection</Button>
              </form>
            </p>

            <p>
              <Button type="submit" bsStyle="success" onClick={this.exportToDevice.bind(this)}>Export to Device</Button>
            </p>

            <p>
              <Button type="submit" bsStyle="success" onClick={this.testMeteorDesktop.bind(this)}>Test meteor-desktop</Button>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}
