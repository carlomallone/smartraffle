import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  contractCallMethods,
  toEthString
} from '../utils'
import {
  update,
  setEvents,
  toggleFetching
} from '../actions/main'
import {
  debugData
} from '../constants'

import styles from '../app.css'

import Header from './header'
import Footer from './footer'
import Panels from './panels'
import PlayerBet from './player_bet'
import GameStatus from './game_status'
import Information from './information'
import Debug from './debug'
import Cookies from 'js-cookie';

class Main extends Component {
  componentWillMount() {
    this.props.web3.eth.getAccounts((err, accounts) => {
      if(accounts && accounts[0]){
        this.startupRoutine()
      } else {
        setInterval(() => {
          this.props.web3.eth.getAccounts((err, accounts) => {
            if(accounts && accounts[0]){
              window.location.reload()
            }
          })
        }, 3000)
      }
    })
  }

  startupRoutine() {
    setTimeout(this.update.bind(this), 500)
    setTimeout(this.showUI.bind(this), 2000)
    setInterval(this.update.bind(this), 5000)
  }

  componentDidMount() {
    const {
      eventContract
    } = this.props

    return eventContract.getPastEvents('allEvents', {
      filter: {},
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, events) => {
      if(!error)
        this.props.setEvents(events)

      return null
    })
    .then(() => { return null })
  }

  showUI() {
    document.querySelector('#first-label').click()
    document.querySelector('.loader.visible').classList.add('transparent')
    document.querySelector('.app.loading').classList.remove('loading')
    setTimeout(() => this.props.toggleFetching(), 2000)
  }

  update(){
    const {
      web3,
      contract,
      coinbase
    } = this.props

    debugData.forEach((el) => {
      let method = contractCallMethods(el)

      try {
        contract[method].call(
          {
            from: coinbase
          }
        )
        .then((res) => {
          if(el === 'isPaused' || el === 'owner') {
            this.props.update(el, res.toString())
          } else {
            try {
              this.props.update(el, res.c[0])
            } catch(e) {
              console.log(`Error: ${e} - Origin: ${el}`)
            }
          }
        })
      } catch(e) {
        console.log(`Error: ${e} - Origin: ${el}`)
      }
    })

    web3.eth.getBalance(coinbase)
    .then((res) => {
      this.props.update('balance', parseInt(res))
      return null
    })
  }

  render() {
    const {
      game,
      isFetching
    } = this.props

    if(!this.props.coinbase) {
      return (
        <div className="app loading">
          <div className="loader visible whitish">
            <div className="metamask-logo" />
            <div>
              Please unlock your MetaMask account to play.
            </div>
            <br></br>
            <div>
              New to dApps? Read more about MetaMask <a target="_blank" href="https://metamask.io/">here</a>.
            </div>
          </div>
        </div>
      )
    }

    if(game === undefined) {
      return (
        <div className="app">
          <div className="loader visible"></div>
        </div>
      )
    } else {
      const {
        jackpotLimit,
        jackpot,
        totalTickets
      } = game

      let ended = Cookies.get('ended')
      let endMessage = ended ? <div className="flash info">The page was reloaded since the raffle ended. Check the last winner in the table below!</div> : null

      if(ended){
        setTimeout(() => {
          if(document.querySelector('#information .flash'))
            document.querySelector('#information .flash').classList.add('gone')
        }, 6500)
        setTimeout(() => {
          Cookies.remove('ended')
        }, 10000)
      }

      let jackpotPercentage = jackpot > 0 ? jackpot / jackpotLimit * 100 : 0

      let bonus, bonusTicketsLeft

      if(jackpotPercentage >= 75){
        bonusTicketsLeft = 1 // Not used
        bonus = 1
      } else if (jackpotPercentage >= 50){
        bonusTicketsLeft = 2250 - totalTickets
        bonus = 2
      } else if (jackpotPercentage >= 25){
        bonusTicketsLeft = 1750 - totalTickets
        bonus = 3
      } else {
        bonusTicketsLeft = 1000 - totalTickets
        bonus = 4
      }

      let h1message = <h1>Buy tickets to win {toEthString(jackpotLimit)}!</h1>
      let h2message = <h2>Hurry up! <span className="highlight">{bonus}X bonus</span> for the next {bonusTicketsLeft} tickets bought</h2>
      if(bonus < 2)
        h2message = <h2>Join now before we run out of tickets :)</h2>

      if(jackpotLimit === jackpot){
        h1message = <h1>Wait while we pick this raffle winner...</h1>
        h2message = <h2>Another SmartRaffle will start in a few moments!</h2>
      }

      return (
        <div className={`app${isFetching ? ' loading' : ''}`}>
          <div className={`loader${isFetching ? ' visible' : ''}`}>
            <div id="hourglass">
              <div id="htop"></div>
              <div id="hbottom"></div>
              <div id="hline"></div>
            </div>
          </div>
          <Header {...this.props} />

          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1" style={{position: 'relative'}}>
                {endMessage}
                <div style={{ textAlign: 'center', margin: '80px 0 30px' }}>
                  {h1message}
                  {h2message}
                  <a
                    style={{color: '#69f', fontWeight: 500}}
                    href="https://faucet.metamask.io/"
                    target="_blank"
                  >
                    Get free ETH to play »
                  </a>
                </div>

                <div className="pure-u-1-2">
                  <GameStatus {...this.props} />
                </div>

                <div className="pure-u-1-2">
                  <PlayerBet {...this.props} />
                </div>

                <Information {...this.props} />

                <Panels {...this.props} />

                <Debug {...this.props} />
              </div>
            </div>
          </main>

          <Footer {...this.props} />
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  const {
    game,
    isFetching
  } = state.main

  return {
    game,
    isFetching
  }
}

const mapDispatchToProps = {
  update,
  setEvents,
  toggleFetching
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
