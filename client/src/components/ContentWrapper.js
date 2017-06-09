import React from 'react';
import IndicatorScopeSelection from './IndicatorScopeSelection';
import { Col } from 'react-bootstrap';
import DataVisualizer from './DataVisualizer';
import AboutApp from './AboutApp';

class ContentWrapper extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Col className="right_col" role="main">
        <AboutApp/>

        <DataVisualizer/>

        <IndicatorScopeSelection/>
      </Col>
    )
  }
}

export default ContentWrapper;