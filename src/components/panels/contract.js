import React, { Component } from 'react'

export default class Contract extends Component {
  render() {
    const {
      contract
    } = this.props

    return (
      <div id="contract">
        <p className="left-margin">Read the verified contract source code
        &nbsp;<a
          href={`https://ropsten.etherscan.io/address/${this.props.contract.address}`}
          target="_blank"
        >
          here.
        </a></p>
      </div>
    )
  }
}
