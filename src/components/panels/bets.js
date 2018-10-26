import React, { Component } from 'react'
import { readableAddress, ethScanLink } from '../../utils'

export default class Bets extends Component {
  render() {
    const {
      web3,
      events
    } = this.props

    if(events['Bet'] && events['Bet'].length > 0) {
      return (
        <div id="bets">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>ETH Amount</th>
                <th>Tickets Boughts</th>
                <th>Link</th>
              </tr>
            </thead>

            <tbody>
              <tr><td colSpan="4">Displaying 25 most recent bets wagered</td></tr>
              {events['Bet'].slice(0, 25).map((item, index) => {
                let { returnValues, transactionHash } = item

                return (
                  <tr key={`${transactionHash}-${index}`} className="bet">
                    <td>{readableAddress(this.props, returnValues[0])}</td>
                    <td>{web3.utils.fromWei(returnValues[1], 'ether').toString()}</td>
                    <td>{returnValues[2]}</td>
                    <td>{ethScanLink(transactionHash)}</td>
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
