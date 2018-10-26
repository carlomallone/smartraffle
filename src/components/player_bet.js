import React, { Component } from 'react'
import Cookies from 'js-cookie';

import {
  toEth,
  toEthString,
  truncateAddress
} from '../utils'

export default class PlayerBet extends Component {
  constructor(props) {
    super()

    this.state = {
      newBet: 0.1
    }

    this.bet         = this.bet.bind(this)
    this.roundBet    = this.roundBet.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.setMaxBet   = this.setMaxBet.bind(this)
    this.setMinBet   = this.setMinBet.bind(this)
  }

  roundBet() {
    const {
      minimumBet,
      maximumBet
    } = this.props.game

    let newBet = parseFloat(this.state.newBet).toFixed(2)
    if(newBet > toEth(maximumBet)){
      this.setMaxBet()
    } else if(newBet < toEth(minimumBet)) {
      this.setMinBet()
    } else {
      this.setState({ newBet: newBet })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.game.jackpot < this.props.game.jackpot){
      setTimeout(() => {
        Cookies.set('ended', true)
        window.location.reload()
      }, 1000)
    }
  }

  componentWillUpdate() {
    if(document.querySelector('#betButton')) {
      document.querySelector('#betButton').addEventListener("mouseenter", () => {
        document.querySelector("#player-box").classList.add('tilted')
      })

      document.querySelector('#betButton').addEventListener("mouseleave", () => {
        document.querySelector("#player-box").classList.remove('tilted')
      })
    }
  }

  componentWillUnmount() {
    if(document.querySelector('#betButton')) {
      document.querySelector('#betButton').removeEventListener("mouseenter")
      document.querySelector('#betButton').removeEventListener("mouseleave")
    }
  }

  setMinBet() {
    const {
      minimumBet
    } = this.props.game

    this.setState({ newBet: toEth(minimumBet) })
  }

  setMaxBet() {
    const {
      maximumBet,
      jackpot,
      jackpotLimit
    } = this.props.game

    let maximumBetNow = Math.min((jackpotLimit-jackpot), maximumBet)

    this.setState({ newBet: toEth(maximumBetNow) })
  }

  bet() {
    window.gtag_report_conversion()

    const {
      maximumBet,
      minimumBet,
      jackpot,
      jackpotLimit
    } = this.props.game

    let maximumBetNow = Math.min((jackpotLimit-jackpot), maximumBet)

    if(!this.state.newBet) {
      alert('Please enter a bet amount')
      return false
    }

    if(parseFloat(this.state.newBet) > maximumBetNow/10000) {
      alert(`Maximum bet allowed right now: ${maximumBetNow/10000} Ether`)
      return false
    }

    if(parseFloat(this.state.newBet) < minimumBet/10000) {
      alert(`Minimum bet allowed right now: ${minimumBet/10000} Ether`)
      return false
    }

    let jackpotEth      = parseFloat(jackpot)/10000
    let jackpotLimitEth = parseFloat(jackpotLimit)/10000
    let newJackpot      = parseFloat(this.state.newBet) + jackpotEth
    let gasLimit

    if(newJackpot >= jackpotLimitEth){
      gasLimit = 500000
    } else {
      gasLimit = 250000
    }

    const {
      web3,
      contract,
      coinbase
    } = this.props

    document.querySelector("#player-box").classList.remove('tilted')
    document.querySelector("#player-box").classList.add('tilted-fixed')

    // Added this since it could take a while on the live network
    document.querySelector("#player-box").classList.add('buy-loader')
    document.querySelector("#player-box").classList.add('wait-message')

    if(gasLimit === 500000){
      setTimeout(() => {
        let updatedBody = `
                            <span class="coupon big">Keeped</span>
                            <span class="coupon small">on the</span>
                            <span class="coupon big">Blockchain</span>
                            <p>You wagered ${toEthString(this.state.newBet*10000)}</p>
                          `

        document.querySelector("#player-box").classList.remove('buy-loader')
        document.querySelector("#player-box").classList.add('bought')
        document.querySelector("#player-box").classList.add('bought-special')
        document.querySelector("#player-box .body").innerHTML = updatedBody
      }, 10000)
    }

    contract.placeBet({
      gas: gasLimit,
      from: coinbase,
      value: web3.utils.toWei(this.state.newBet.toString(), 'ether')
    })
    .then((result) => {
      document.querySelector("#player-box").classList.remove('wait-message')
      document.querySelector("#player-box").classList.add('almost-message')
    })
    .catch((error) => {
      document.querySelector("#player-box").classList.remove('tilted-fixed')
      document.querySelector("#player-box").classList.remove('wait-message')
      document.querySelector("#player-box").classList.remove('buy-loader')
    })
  }

  handleInput(event) {
    this.setState({newBet: event.target.value})
  }

  render() {
    const {
      game,
      coinbase
    } = this.props

    const {
      playerBet,
      playerTickets,
      minimumBet,
      maximumBet,
      jackpotLimit,
      jackpot
    } = game

    let maximumBetNow = Math.min((jackpotLimit-jackpot), maximumBet)

    let jackpotPercentage = jackpot > 0 ? jackpot / jackpotLimit * 100 : 0

    let bonus = jackpotPercentage >= 75 ? 1 : (jackpotPercentage >= 50 ? 2 : (jackpotPercentage >= 25 ? 3 : 4))
    let multiplier = bonus * 100
    let ticketsAmount = (this.state.newBet * multiplier).toFixed(0)
    let body

    if(jackpotLimit === jackpot) {
      return (
        <div
          id="player-box"
          className="big-box last"
        >
          <div className="logo-ticket">
            <div
              data-number={truncateAddress(coinbase)}
            >
              <br></br>
              <span className="coupon big">Drawing</span>
              <span className="coupon small">the</span>
              <span className="coupon big">Winner!</span>
              <p>Waiting for the Ethereum blockchain...</p>
            </div>
          </div>
        </div>
      )
    }

    if(playerBet) {
      body =  <div className="body">
                <span className="coupon big">Keeped</span>
                <span className="coupon small">on the</span>
                <span className="coupon big">Blockchain</span>
                <p>You wagered {toEthString(playerBet)} and got {JSON.stringify(playerTickets)} tickets</p>
              </div>
    } else {
      body = <div className="body">
              <div className="flex-container">
                <div>
                  <input
                    ref="betInput"
                    name="betInput"
                    type="number"
                    min={toEth(minimumBet)}
                    max={toEth(maximumBetNow)}
                    step={toEth(minimumBet)}
                    value={this.state.newBet}
                    onChange={this.handleInput}
                    onBlur={this.roundBet}
                  />

                  <div className="flex-container">
                    <button
                      name="minBetButton"
                      onClick={this.setMinBet}
                    >
                      {toEthString(minimumBet)}
                    </button>
                    <button
                      name="maxBetButton"
                      onClick={this.setMaxBet}
                    >
                      {toEthString(maximumBetNow)}
                    </button>
                  </div>
                </div>

                <div className="flex-container">
                  <p className="tickets-msg">
                    <span className="big">
                      {ticketsAmount} tickets
                    </span>
                    <span className="small">
                      out of 2500
                    </span>
                    <span className="small">
                      =
                    </span>
                    <span className="big">
                      {(ticketsAmount/25).toFixed(2)}% chance
                    </span>
                  </p>
                </div>
              </div>

              <p className="wait-msg">
                Please allow up to 2 minutes...
              </p>

              <p className="almost-msg">
                Almost there... Hold tight! :)
              </p>

              <button
                id="betButton"
                name="betButton"
                onClick={this.bet}
                className="primary"
              >
                BUY {ticketsAmount} TICKETS FOR {parseFloat(this.state.newBet).toFixed(2)} ETH
              </button>
            </div>
    }

    return (
      <div
        id="player-box"
        className={`big-box last${playerBet ? ' bought' : ''}`}
      >
        <div className="logo-ticket">
          <div
            data-number={truncateAddress(coinbase)}
          >
            {body}
          </div>
        </div>
        <div className="rubber-stamp">{playerTickets*100/playerBet}X BONUS</div>
      </div>
    )
  }
}
