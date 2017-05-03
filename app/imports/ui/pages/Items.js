import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import ItemsList from '../components/ItemList';

const Items = () => (
  <div className="Items">
    <Row>
      <Col xs={ 12 }>
        <div className="page-header clearfix">
          <h4 className="pull-left">Items</h4>
          <Link to="/items/new">
            <Button
              bsStyle="success"
              className="pull-right"
            >New Document</Button>
          </Link>
        </div>
        <ItemsList />
      </Col>
    </Row>
  </div>
);

export default Items;
