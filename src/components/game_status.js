import React, { Component } from 'react'

import {
  truncateAddress
} from '../utils'

class ProgressBar extends Component {
  render() {
    const {
      jackpotPercentage,
      totalTickets,
      soldTickets
    } = this.props

    let filledStyle = {
      width: `${jackpotPercentage}%`
    }

    let bigEnough = jackpotPercentage > 45 ? true : false
    let spanInFilled = <span>{soldTickets}/{totalTickets} sold</span>
    let spanInContainer = <span>{soldTickets}/{totalTickets} sold</span>

    return (
      <div className="progress-bar">
        <div
          className="container"
        >
          <div
            className="filled"
            style={filledStyle}
          >
            {bigEnough && spanInFilled}
          </div>
          {!bigEnough && spanInContainer}
        </div>
      </div>
    )
  }
}

export default class Information extends Component {
  render() {
    const {
      game,
      contract
    } = this.props

    const {
      jackpotLimit,
      jackpot,
      totalTickets
    } = game

    let jackpotPercentage = jackpot > 0 ? jackpot / jackpotLimit * 100 : 0
    let bonus = jackpotPercentage > 75 ? 1 : (jackpotPercentage > 50 ? 2 : (jackpotPercentage > 25 ? 3 : 4))
    let bar = <ProgressBar
                jackpotPercentage={jackpotPercentage}
                soldTickets={totalTickets}
                totalTickets={2500}
              />

    let message = <p>HURRY UP!<br></br>Buy now to get <span className="accent">{bonus}X tickets</span></p>
    if(bonus === 1)
      message = <p>HURRY UP!<br></br>The raffle is quickly coming to its end!</p>
    if(jackpot === jackpotLimit) {
      message = <p>HOORAY!<br></br>Let's wait for the winner draw now...</p>
      bar = null
    }


    return (
      <div
        id="game-status"
        className="big-box first"
      >
        <div className="logo-ticket">
          <div
            data-number={truncateAddress(contract.address)}
          >
            <div className="">
              <p>
                <span className="number">
                  {jackpot/10000}/{jackpotLimit/10000}
                </span>
                ETH
              </p>

              {bar}

              {message}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

