import React from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import DeviceProfiles from '../../api/deviceprofiles/deviceprofiles';
import PlatformAliases from '../../api/platformaliases/platformaliases';
import ExportProfiles from '../../api/exportprofiles/exportprofiles';

export default class extends React.Component {
  render() {
    return (
      <div className="Devices">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Devices</h4>
            {DeviceProfiles.find().fetch().length} devices<br/>
            {PlatformAliases.find().fetch().length} platform aliases<br/>
            {ExportProfiles.find().fetch().length} export profiles
          </Col>
        </Row>
      </div>
    );
  }
}
