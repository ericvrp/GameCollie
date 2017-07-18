import React from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

// https://www.youtube.com/watch?v=Nv_Teb--1zg

import IPFS from 'ipfs' // https://github.com/ipfs/js-ipfs
console.log(IPFS)

const ipfs = new IPFS()
console.log(ipfs)

ipfs.once('ready', () => ipfs.id((err, info) => {
  if (err) throw err
  console.log('IPFS node ready with address', info.id)
}))

export default class extends React.Component {
  render() {
    return (
      <div className="IPFS">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">IPFS code goes here</h4>
          </Col>
        </Row>
      </div>
    );
  }
}
