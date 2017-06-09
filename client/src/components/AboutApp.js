import React from 'react';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import '../css/index.css';

export default class AboutApp extends React.Component {
  constructor() {
    super();

    this.state = {
      shown: true
    }
  }

  close = () => {
    this.setState({
      shown: false
    })
  };

  render() {
    if(!this.state.shown) {
      return null;
    }

    return (
      <Row>
        <Col xs={12} sm={12} md={12} className="x_panel">
          <Row className="x_title">
            <Col xs={12} sm={12} md={12}>
              <h2>How to use this app</h2>
              <h2 className="tutorial-close" onClick={this.close}><Glyphicon glyph="remove"/></h2>
            </Col>
          </Row>
          <Row className="x-content">
            <Col xs={12} sm={12} md={12}>
              <ul>
                <li>Select indicator from left</li>
                <li>Select area of interest from bottom</li>
                <li>Select date range from top right</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}