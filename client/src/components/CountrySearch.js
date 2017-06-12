import React from 'react';
import Autosuggest from 'react-autosuggest';
import FuzzySearch from 'fuzzy-search';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../css/countrySearch.css';

const mapStateToProps = state => {
  return {
    countriesNamesMapping: state.countries.countriesNamesMapping,
    selections: state.filters.selections.filter(({ type }) => type === 'country')
  }
};

class CountrySearch extends React.Component {
  static propTypes = {
    onValue: PropTypes.func
  };

  constructor() {
    super();

    this.state = {
      suggestValue: '',
      suggestions: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      suggestValue: '',
      suggestions: []
    })
  }

  getSuggestions = value => {
    const { countriesNamesMapping, selections } = this.props;
    let countriesArray = countriesNamesMapping
      .filter((country, code) => !selections.find(({ country }) => country === code)) // filter out already selected
      .map((country, code) => { return {code, country} }).toArray();  // so that fuzzysearch can understand data

    const searcher = new FuzzySearch(countriesArray, ['country'], {sort: true});
    return searcher.search(value);
  };

  getSuggestionValue = suggestion => {
    if(this.props.onValue) {
      this.props.onValue(suggestion.code);
    }
    return '';
  };

  renderSuggestion = suggestion => (
    <span>
      {suggestion.country}
    </span>
  );


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  };

  onSuggestBoxChange = (event, { newValue }) => {
    this.setState({
      suggestValue: newValue
    });
  };

  render() {
    const { suggestValue, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Search for country',
      value: suggestValue,
      onChange: this.onSuggestBoxChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    )
  }
}

export default connect(mapStateToProps)(CountrySearch);