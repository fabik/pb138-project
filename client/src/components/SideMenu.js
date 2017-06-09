import React from 'react';
import PropTypes from 'prop-types';
import { Clearfix, Navbar, Col } from 'react-bootstrap';

class SideMenu extends React.Component {
  //noinspection JSUnusedGlobalSymbols,JSUnresolvedFunction,JSUnresolvedVariable
  static propTypes = {
    title: PropTypes.string.isRequired,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func
      })
    ),
    selectedIndex: PropTypes.number,
    loading: PropTypes.bool
  };

  //noinspection JSUnusedGlobalSymbols
  static defaultProps = {
    title: "",
    menuItems: [],
    loading: false
  };

  constructor() {
    super();

    this.state = {
      navFull: true
    }
  }

  menuSizeToggle = () => {
    const { navFull: navFullOld } = this.state;
    this.setState({
      navFull: !navFullOld
    });

    $('body').toggleClass('nav-md nav-sm');
  };

  render() {
    const { navFull } = this.state;
    const activeClass = navFull ? 'active' : 'active-sm';

    const menuContent = this.props.loading ? (
      <div>
        <pre>Loading</pre>
      </div>
    ) : (
      <div className="menu_section">
        <h3>Select data:</h3>
        <ul className="nav side-menu">
          {this.props.menuItems.map((item, index) => {
            return (
              <li key={index} className={index === this.props.selectedIndex ? activeClass : ''}>
                <a onClick={item.onClick}>
                  <i className="fa fa-bar-chart-o"/>{item.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    );

    return (
      <Col md={3} className="left_col">
        <div className="left_col scroll-view">
          <Navbar className="nav_title" style={{"border": "0"}}>
              <div className="site_title">
                <div className="nav toggle">
                  <a id="menu_toggle" style={{marginRight: "10px"}} onClick={this.menuSizeToggle}>
                    <i style={{color: "#cbcbcb"}} className="fa fa-bars"/>
                  </a>
                </div>
                <span>{this.props.title}</span>
              </div>
          </Navbar>

          <Clearfix/>

          <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
            {menuContent}
          </div>

          <div className="sidebar-footer hidden-small">
            <span>Data source: <a target="_blank" href="http://data.worldbank.org/data-catalog/">worldbank.org</a></span>
          </div>
        </div>
      </Col>
    )
  }
}

export default SideMenu;