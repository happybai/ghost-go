import React, { Component, PropTypes } from 'react'
import Navigation from '../presentations/Navigation'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'
import Board from '../presentations/Board'
import ControlBar from '../presentations/ControlBar'
import lang from '../components/lang'
import { connect } from 'react-redux'
import { fetchKifu } from '../actions/KifuActions'
import { Link } from 'react-router'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import Layout from './Layout'

class Kifus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      kifu: null
    }
    let { id } = this.props.params
    this.props.dispatch(fetchKifu(id))
  }

  render() {
    const { kifu } = this.props
    return (
      <Layout>
        <div className="kifu-container">
          <div className="kifu-board">
            <Board className="board"
                   editable="false"
                   kifu={kifu.data.steps}
                   ref="board" />
            <ControlBar board={this.refs.board} />
          </div>
          <div className="kifu-info">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.black' defaultMessage="Black" />
                  </td>
                  <td>
                    { this.props.kifu.data.b_name }&nbsp;&nbsp;&nbsp;
                    { this.props.kifu.data.b_rank }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.white' defaultMessage="White" />
                  </td>
                  <td>
                    { this.props.kifu.data.w_name }&nbsp;&nbsp;&nbsp;
                    { this.props.kifu.data.w_rank }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.result' defaultMessage="Result" />
                  </td>
                  <td>
                    { this.props.kifu.data.result }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.title' defaultMessage="Title" />
                  </td>
                  <td>
                    { this.props.kifu.data.title }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.place' defaultMessage="Place" />
                  </td>
                  <td>
                    { this.props.kifu.data.place }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.komi' defaultMessage="Komi" />
                  </td>
                  <td>
                    { this.props.kifu.data.komi }
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id='app.kifu.date' defaultMessage="Date" />
                  </td>
                  <td>
                    { this.props.kifu.data.date }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    )
  }
}

function select(state) {
  return {
    kifu: state.kifu
  }
}

export default connect(select)(Kifus)
