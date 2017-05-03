import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import FileList from '../components/FileList';

const Files = () => (
  <div className="Files">
    <Row>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">Files</h4>
        </div>
        <FileList />
      </Col>
    </Row>
  </div>
);

// <Link to="/files/new">
//             <Button
//               bsStyle="success"
//               className="pull-right"
//             >New Document</Button>
//           </Link>

export default Files;
