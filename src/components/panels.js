import React, { Component } from 'react'
import { connect } from 'react-redux'

import Transactions from './panels/transactions'
import Bets from './panels/bets'
import Wins from './panels/wins'
import Faqs from './panels/faqs'
import Contract from './panels/contract'

class Panels extends Component {
  render() {
    return (
      <div className="tabs">
        <input
          type="radio"
          id="tab-bets"
          name="nav-tab"
        ></input>
        <input
          type="radio"
          id="tab-wins"
          name="nav-tab"
        ></input>
        <input
          type="radio"
          id="tab-faqs"
          name="nav-tab"
        ></input>
        <input
          type="radio"
          id="tab-contract"
          name="nav-tab"
        ></input>

        <ul className="nav-tabs">
          <li>
            <label
              htmlFor="tab-bets"
              id="first-label"
            >
              Tickets Bought
            </label>
          </li>
          <li>
            <label
              htmlFor="tab-wins"
            >
              Previous Winners
            </label>
          </li>
          <li>
            <label
              htmlFor="tab-faqs"
            >
              Frequently Asked Questions
            </label>
          </li>
          <li>
            <label
              htmlFor="tab-contract"
            >
              Smart Contract
            </label>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane content-bets">
            <Bets {...this.props} />
          </div>
          <div className="tab-pane content-wins">
            <Wins {...this.props} />
          </div>
          <div className="tab-pane content-faqs">
            <Faqs {...this.props} />
          </div>
          <div className="tab-pane content-contract">
            <Contract {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    events
  } = state.main

  return {
    events
  }
}

export default connect(
  mapStateToProps,
  null
)(Panels)
