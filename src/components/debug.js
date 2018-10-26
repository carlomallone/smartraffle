import React, { Component } from 'react'

import {
  debugData
} from '../constants'

export default class Debug extends Component {
  abortGame() {
    this.props.contract.abortGame({
      from: this.props.coinbase,
      gas: 6000000
    }).then((result) => { }).catch((error) => { })
  }

  render() {
    let role, address, abortBox, abortButton

    const {
      web3,
      game,
      coinbase
    } = this.props

    abortButton = <button
                      name="abortButton"
                      onClick={this.abortGame.bind(this)}
                    >
                      Abort and Refund
                    </button>

    if(web3){
      role = coinbase === game.owner ? 'the owner' : 'a player'
      abortBox = coinbase === game.owner ? abortButton : null
      address = coinbase
    }

    return (
      <div
        id="debug"
        style={{display: 'none'}}
      >
        <h3>Debug dump</h3>
        <p>You are {role} ({address})</p>
        {abortBox}
        <ul>
          {debugData.map((el) => {
            return (
              <li key={el}>{el}: {game[el] != null ? JSON.stringify(game[el]) : '-'}</li>
            )
          })}
          <li key="balance">Player balance: {game['balance'] != null ? JSON.stringify(game['balance']) : '-'}</li>
        </ul>
      </div>
    )
  }
}
