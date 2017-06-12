import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { from2To3 } from '../countryCodesConvertor';

import WorldCountriesMap from './WorldContriesMap';
import WorldRegionsMap from './WorldRegionsMap';

import { addSelection, removeSelection } from '../actions/filters';
import { updateWorldIndicator, updateCountriesIndicator, updateRegionsIndicator } from '../actions/data';

const mapStateToProps = state => {
  return {
    selections: state.filters.selections
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCountryToSelection: (country, color) => dispatch(addSelection(ownProps.selectedIndicator, {type: 'country', country, color})),
    removeCountryFromSelections: country => dispatch(removeSelection(ownProps.selectedIndicator, {type: 'country', country})),
    addWorldToSelections: color => dispatch(addSelection(ownProps.selectedIndicator, {type: 'world', color})),
    removeWorldFromSelections: () => dispatch(removeSelection(ownProps.selectedIndicator, {type: 'world'})),
    addRegionToSelections: (region, color) => dispatch(addSelection(ownProps.selectedIndicator, {type: 'region', region, color})),
    removeRegionFromSelections: region => dispatch(removeSelection(ownProps.selectedIndicator, {type: 'region', region})),
    updateWorldIndicator: () => dispatch(updateWorldIndicator()),
    updateRegionsIndicator: () => dispatch(updateRegionsIndicator()),
    updateCountriesIndicator: () => dispatch(updateCountriesIndicator())
  }
};

class IndicatorScopeSelection extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  constructor() {
    super();

    this.state = {
      worldSelected: false,
      selectedScope: 'countries'  // 'regions'|'countries'
    }
  }

  countriesMapSelected = (code, color) => {
    this.props.addCountryToSelection(code, color);
    this.props.updateCountriesIndicator();
  };

  countriesMapDeselected = code => {
    this.props.removeCountryFromSelections(code);
  };

  regionsMapSelected = (code, color) => {
    this.props.addRegionToSelections(code, color);
    this.props.updateRegionsIndicator();
  };

  regionsMapDeselect = code => {
    this.props.removeRegionFromSelections(code);
    this.props.updateRegionsIndicator();
  };

  worldClicked = () => {
    const { worldSelected: ws } = this.state;

    if(ws) {
      this.props.removeWorldFromSelections();
    } else {
      this.props.addWorldToSelections();
      this.props.updateWorldIndicator();
    }

    this.setState({
      worldSelected: !ws
    });
  };

  regionsClicked = () => {
    this.setState({
      selectedScope: 'regions'
    })
  };

  countriesClicked = () => {
    this.setState({
      selectedScope: 'countries'
    })
  };

  render() {
    const { selectedScope: sc, worldSelected: ws } = this.state;

    return (
      <Row className="scope-selection">
        <Col xs={12} sm={12} md={12} className="x_panel">
          <Row className="x_title">
            <Col xs={3} sm={3} md={3}>
              <h2>Selection</h2>
            </Col>
            <Col xs={9} sm={9} md={9}>
              <ButtonToolbar>
                <Button onClick={this.worldClicked}
                        active={ws}
                        style={ws?{backgroundColor: this.props.selections.find(s => s.type === 'world').color}:{}}
                >World</Button>
                <Button onClick={this.regionsClicked} active={sc === 'regions'}>Regions</Button>
                <Button onClick={this.countriesClicked} active={sc === 'countries'}>Countries</Button>
              </ButtonToolbar>
            </Col>
          </Row>
          <Row className="x_content">
            <Col xs={12} sm={12} md={12}>
              <WorldRegionsMap style={sc === 'regions' ? {}:{display: "none"}}
              onSelect={this.regionsMapSelected} onDeselect={this.regionsMapDeselect} />
              <WorldCountriesMap style={sc === 'countries' ? {}:{display: "none"}}
              onSelect={this.countriesMapSelected} onDeselect={this.countriesMapDeselected} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorScopeSelection);