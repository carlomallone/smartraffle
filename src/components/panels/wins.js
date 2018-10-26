import React, { Component } from 'react'
import { readableAddress, ethScanUserLink } from '../../utils'

export default class Wins extends Component {
  render() {
    const {
      web3,
      events
    } = this.props

    if(events['Win'] && events['Win'].length > 0) {
      return (
        <div id="wins">
          <table>
            <thead>
              <tr>
                <th>Winner</th>
                <th>Amount</th>
                <th>Number</th>
                <th>Link</th>
              </tr>
            </thead>

            <tbody>
              <tr><td colSpan="4">Displaying 25 most recent winners' address</td></tr>
              {events['Win'].slice(0, 25).map((item, index) => {
                let { returnValues, transactionHash } = item

                return (
                  <tr key={`${transactionHash}-${index}`} className="win">
                    <td>{readableAddress(this.props, returnValues[0])}</td>
                    <td>{web3.utils.fromWei(returnValues[1], 'ether').toString()}</td>
                    <td>{returnValues[2]}</td>
                    <td>{ethScanUserLink(returnValues[0])}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    } else {
      return <p className="left-margin">Nothing to show yet.</p>
    }
  }
}
