import React, { Component } from 'react'

export default class Information extends Component {
  render() {
    const {
      game
    } = this.props

    const {
      jackpotLimit,
      houseCut
    } = game

    return (
      <div
        id="information"
        className="pure-g"
      >
        <div className="pure-u-1-3">
          <i className="fab fa-ethereum"></i>
          <span>A provably fair raffle on the ETH blockchain.
          No signups nor deposits needed.
          Nearly instant payouts. Just play!</span>
        </div>
        <div className="pure-u-1-3">
          <i className="fas fa-ticket-alt"></i>
          <span>The SmartRaffle ends as soon as the 2500 tickets are issued.
          Next raffle starts right after the winning ticket is drawn!</span>
        </div>
        <div className="pure-u-1-3">
          <i className="far fa-hourglass"></i>
          <span>The winner prize amount is {100-houseCut}%
          of the total {jackpotLimit/10000} ETH wagered.
          Early bettors get bonus tickets! Read the FAQ for more details.</span>
        </div>
      </div>
    )
  }
}
