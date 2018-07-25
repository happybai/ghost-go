import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Auth from '../common/Auth';
import BoardToolbar from './BoardToolbar';

import { toggleSidebar } from '../actions/Actions';

function mapStateToProps(state) {
  return {
    auth: state.ui.auth,
    ui: state.ui,
  };
}

@connect(mapStateToProps)
export default class Navigation extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
    dispatch: PropTypes.func.isRequired,
    ui: PropTypes.shape({
      sidebar: PropTypes.shape({
        collpased: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      navOpen: false,
      profile: Auth.getProfile(),
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSidebar = this.handleSidebar.bind(this);
  }

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  componentDidMount() {
  }

  handleToggle() {
    this.setState({ navOpen: !this.state.navOpen });
  }

  handleSidebar() {
    this.props.dispatch(toggleSidebar());
  }

  handleLogout() {
    this.setState({ navOpen: false });
    const auth = new Auth();
    auth.logout();
  }

  mouseDownHandler() {
    this.mouseIsDownOnCalendar = true;
  }

  mouseUpHandler() {
    this.mouseIsDownOnCalendar = false;
  }

  render() {
    const { auth } = this.props;
    const { profile, navOpen } = this.state;
    return (
      <div id="page-header">
        <div style={{ marginLeft: this.props.ui.sidebar.collpased ? '-185px' : '0px' }} id="header-logo">
          <span>GHOSTGO <i className="opacity-80">&nbsp;- &nbsp;beta.3</i></span>
          <a role="button" tabIndex={0} onKeyPress={() => {}} onClick={this.handleSidebar} id="collapse-sidebar" title="">
            <i className="fa fa-chevron-left" />
          </a>
        </div>
        <div id="sidebar-search" />
        <div style={{ paddingLeft: this.props.ui.sidebar.collpased ? '50px' : '235px' }} className="theme">
          <BoardToolbar />
        </div>
        <div role="button" tabIndex={0} id="header-right" onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}>
          {
            Auth.isAuthenticated() && profile ? (
              <div>
                <div className="user-profile dropdown">
                  <a role="button" tabIndex={0} onKeyPress={() => {}} onClick={this.handleToggle} className="user-ico clearfix" data-toggle="dropdown" aria-expanded="false">
                    <img width="36" src={profile.picture} alt="" />
                    <i className="fa fa-chevron-down" />
                  </a>
                  <div style={{ display: navOpen ? 'block' : 'none' }} className="dropdown-menu account">
                    <div className="box-sm">
                      <div className="login-box clearfix">
                        <div className="user-img"><img src={profile.picture} alt="" /></div>
                        <div className="user-info">
                          <span>{this.state.profile.nickname}<i>Welcome back!</i></span>
                          <Link to="/dashboard">
                            Dashboard
                          </Link>
                          {/*
                          <a href="#" title="">View notifications</a>
                          */}
                        </div>
                      </div>
                      {/*
                      <div className="divider"></div>
                      <ul className="reset-ul mrg5B">
                        <li>
                          <a href="#">
                            View login page example
                            <Glyphicon className="icon" glyph="menu-right" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            View lockscreen example
                            <Glyphicon className="icon" glyph="menu-right" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            View account details
                            <Glyphicon className="icon" glyph="menu-right" />
                          </a>
                        </li>
                      </ul>
                      */}
                      <div onKeyPress={this.handleLogout} onClick={this.handleLogout} className="text-center button-pane">
                        <a className="btn display-block font-normal btn-danger"><i className="glyph-icon icon-power-off" />Logout</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="top-icon-bar">
                  {/*
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#" title="">
                      <Glyphicon glyph="linecons-cog" />
                      <Glyphicon glyph="align-left" />
                      <Glyphicon glyph="star" />
                      <Glyphicon glyph="linecons-cog" />
                      <Glyphicon glyph="linecons-megaphone" /> </a>
                  </div>
                  <div className="dropdown">
                    <a data-toggle="dropdown" href="#" title="">
                      <Glyphicon glyph="linecons-cog" />
                      <Glyphicon glyph="linecons-megaphone" />
                      <i className="fa fa-cog"></i>
                    </a>
                  </div>
                  */}
                </div>
              </div>
            ) : (
              <div className="user-profile dropdown login">
                <Button onClick={auth.login} className="signin clearfix" bsStyle="primary">
                  Sign in
                </Button>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
