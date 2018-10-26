import React, { Component } from 'react'
import { connect } from 'react-redux'

import { readableAddress, ethScanLink } from '../../utils'
import {
  addTransactions
} from '../../actions/main'

class Transactions extends Component {
  componentWillMount() {
    const {
      web3
    } = this.props

    // This gets all the transactions, and filter them it would be a pain
    // web3.eth.getBlockNumber()
    // .then((res) => {
    //   let limit = Math.min(50, res)

    //   for (let i=res; i > res-limit; i--) {
    //     web3.eth.getBlock(i, true)
    //     .then((block) => {
    //       if(block != null && block.transactions != null) {
    //         this.props.addTransactions(block.transactions.reverse())
    //       }
    //     })
    //   }
    // })
  }

  render() {
    const {
      web3
    } = this.props

    if(this.props.transactions.length > 0) {
      return (
        <div id="transactions">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              <tr><td colSpan="4">Displaying 25 most recent transactions</td></tr>
              {this.props.transactions.filter((t) => t.value > 0).slice(0, 25).map((transaction, index) => {
                return (
                  <tr key={`${transaction.hash}-${index}`} className="transaction">
                    <td>{readableAddress(this.props, transaction.from)}</td>
                    <td>{readableAddress(this.props, transaction.to)}</td>
                    <td>{web3.utils.fromWei(transaction.value, 'ether').toString()}</td>
                    <td>{ethScanLink(transaction.hash)}</td>
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

const mapStateToProps = (state) => {
  const {
    transactions
  } = state.main

  return {
    transactions
  }
}

const mapDispatchToProps = {
  addTransactions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

