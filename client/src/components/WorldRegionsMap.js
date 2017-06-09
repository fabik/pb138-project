import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gen from 'color-generator';
import _ from 'lodash';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';

import { from3To2 } from '../countryCodesConvertor';

const mapStateToProps = state => {
  return {
    regionsNamesMapping: state.regions.regionsNamesMapping,
    countriesMapping: state.regions.countriesMapping
  }
};

class Map extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    data: PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      // computed on iso 3166-2 instead of 3166-3 as in redux store
      regionCountriesMapping: {},  // {<region_code>: [<country_code>, <country_code>, ...]
      regionsColors: {},
      selectedRegions: [],
      defaultColor: '#fff'
    };
  }

  mapClicked = (element, code, region) => {
    setTimeout(() => {  // prevent default jqvmap selection, have to be inside setTimeout
      this.vectorMapElement.vectorMap('deselect', code);
    }, 0);

    // find region by country
    const { regionCountriesMapping } = this.state;
    let selectedRegion = null;
    _.forEach(Object.keys(regionCountriesMapping), regionCode => {
      if(_.includes(regionCountriesMapping[regionCode], code)) {
        selectedRegion = regionCode;
      }
    });

    if(selectedRegion) {
      this.regionClicked(selectedRegion);
    }

    if(this.props.onClick) {
      this.props.onClick(element, code, region);
    }
  };

  componentWillReceiveProps(nextProps) {
    // ISO-3166-2: 2 chars codes, ISO-3166-3: 3 chars codes (what we got from backend)
    const { regionsNamesMapping, countriesMapping } = nextProps;
    if(regionsNamesMapping !== this.props.regionsNamesMapping ||
       countriesMapping !== this.props.countriesMapping) {
      const randomColor = () => gen(.7).alpha(.7).rgbaString();

      let regionCountriesMapping = {};
      regionsNamesMapping.keySeq().forEach(regionCode => {
        regionCountriesMapping[regionCode] = [];
        const countries = countriesMapping.get(regionCode);
        countries.forEach(countryCode => {
          const iso3166twoCode = from3To2(countryCode);
          regionCountriesMapping[regionCode].push(iso3166twoCode);
        });
      });
      this.setState({
        regionCountriesMapping
      });

      let mapColors = {};
      Object.keys(regionCountriesMapping).map(regionCode => {
        const regionColor = randomColor();
        _.forEach(regionCountriesMapping[regionCode], countryCode => {
          if(mapColors[countryCode]) {
            //console.log("!! already exist ", countryCode)
          }

          mapColors[countryCode] = regionColor;
        })
      });

      //this.vectorMapElement.vectorMap('set', 'colors', mapColors);
    }
  }

  componentDidMount() {
    this.vectorMapElement = $(this.mapElement);
    this.vectorMapElement.vectorMap({
      map: 'world_en',
      backgroundColor: '#ffffff',
      color: '#ffffff',
      hoverOpacity: 0.7,
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      multiSelectRegion: true,
      onRegionClick: this.mapClicked
    });
  }

  randomColor = () => gen(.7).alpha(.7).rgbaString();

  paintRegionCountries = (region, color) => {
    const { regionCountriesMapping } = this.state;

    if(!color) {
      color = this.state.defaultColor;
    }

    let mapColors = {};
    _.forEach(regionCountriesMapping[region], countryCode => {
      mapColors[countryCode] = color;
    });

    this.vectorMapElement.vectorMap('set', 'colors', mapColors);
  };

  regionClicked = code => {
    const { selectedRegions } = this.state;

    if(_.includes(selectedRegions, code)) { // remove region
      let newRegionsColors = this.state.regionsColors;
      delete newRegionsColors[code];
      this.setState({
        selectedRegions: _.filter(this.state.selectedRegions, region => region !== code),
        regionsColors: newRegionsColors
      });
      this.paintRegionCountries(code);

      if(this.props.onDeselect) {
        this.props.onDeselect(code);
      }
    } else {  // select region
      const color = this.randomColor();
      let newRegionsColors = this.state.regionsColors;
      newRegionsColors[code] = color;
      this.setState({
        selectedRegions: this.state.selectedRegions.concat(code),
        regionsColors: newRegionsColors
      });
      this.paintRegionCountries(code, color);

      if(this.props.onSelect) {
        this.props.onSelect(code, color);
      }
    }
  };

  render() {
    const { regionsNamesMapping } = this.props;
    const { regionsColors } = this.state;

    // const regionsList = regionNamesMapping.valuesSeq().forEach(value => <ListGroupItem>{value}</ListGroupItem>);
    let regionsList = [];
    regionsNamesMapping.entrySeq().forEach(entry => {
      regionsList.push({code: entry[0], region: entry[1]});
    });

    return (
      <Row>
        <Col md={3} style={this.props.style}>
          <ListGroup>
            {regionsList.map(regionItem =>
              <ListGroupItem
                className="region-list-item"
                key={regionItem.code}
                onClick={() => this.regionClicked(regionItem.code)}
                style={regionsColors[regionItem.code]?{background: regionsColors[regionItem.code]}:{}}
              >{regionItem.region}</ListGroupItem>
            )}
          </ListGroup>
        </Col>
        <Col md={9}>
          <div
            style={{...this.props.style, height: "40vw", width: "100%"}}
            ref={e => this.mapElement = e}/>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps)(Map);