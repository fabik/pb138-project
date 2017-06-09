import React from 'react';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import { Button, FormControl, FormGroup, ControlLabel, InputGroup, Col, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';

class DateRangePicker extends React.Component {
  static propTypes = {
    onApply: PropTypes.func,
    onDidMount: PropTypes.func
  };

  constructor() {
    super();

    const startDate = moment().subtract(10-1, 'year');
    const endDate = moment();

    this.state = {
      startDate,
      endDate,
      ranges: {
        // '1 year': [moment().subtract(1-1, 'year'), moment()],
        '2 years': [moment().subtract(2-1, 'year'), moment()],
        '5 years': [moment().subtract(5-1, 'year'), moment()],
        '10 years': [moment().subtract(10-1, 'year'), moment()],
        '20 years': [moment().subtract(20-1, 'year'), moment()],
        '50 years': [moment().subtract(50-1, 'year'), moment()],
      },
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;
    if(this.props.onDidMount) {
      this.props.onDidMount(startDate, endDate);
    }
  }

  handleApply = (event, picker) => {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });

    if(this.props.onApply) {
      this.props.onApply(picker);
    }
  };

  render() {
    let start = this.state.startDate.format('YYYY-MM-DD');
    let end = this.state.endDate.format('YYYY-MM-DD');
    let label = start + ' - ' + end;
    if (start === end) {
      label = start;
    }

    return (
      <FormGroup>
        <ControlLabel className="col-md-3">Date range</ControlLabel>
          <DatetimeRangePicker
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            maxDate={moment()}
            ranges={this.state.ranges}
            opens='left'
            showDropdowns={false}
            showWeekNumbers={false}
            buttonClasses={['btn btn-default']}
			      applyClass='btn-small btn-primary'
			      cancelClass='btn-small'
            onApply={this.handleApply}
          >
            <InputGroup>
              <FormControl type='text' value={label} onChange={() => null}/>
              <InputGroup.Button>
                    <Button className="default date-range-toggle">
                      <Glyphicon glyph="calendar" style={{color: "#000"}}/>
                    </Button>
                </InputGroup.Button>
            </InputGroup>
          </DatetimeRangePicker>
      </FormGroup>
    );
  }
}

export default DateRangePicker;