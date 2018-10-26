import React, { Component } from 'react'

export default class Faqs extends Component {
  render() {
    const {
      game
    } = this.props

    const {
      jackpotLimit,
      houseCut
    } = game

    let faqs = [
      {
        q: `Why does the winner gets ${100-houseCut}% of the total amount?`,
        a: <span>We're getting the missing {houseCut}% as the house cut and to
            pay Oraclize fee for the random number generation (more on this below).
            <br></br>It's {houseCut}% of the {jackpotLimit/10000} ETH grand total so {jackpotLimit/1000000*houseCut} ETH.
            <br></br>In comparison, offline lottery or real money raffles take
             20% or more as the house cut.
            </span>
      },
      {
        q: 'Do I need an account?',
        a: <span>Thanks to the Ethereum blockchain and the MetaMask extension your
            sending address IS your account. No need for signups nor
            deposits! You can track all winners, bets and transactions
            from within this table or visiting the Ethplorer contract page
             (link is in the page header).
            </span>
      },
      {
        q: 'How does the tickets bonus work?',
        a: <span>The basic ratio is 1 ticket for each 0.01 ETH wagered, meaning
            you'll get exactly one ticket if you bet the minimum amount
            possible, and 100 if you bet the maximum.<br></br>To incentivize early
            bettors we're offering bonus tickets depending on the percentage
            of total jackpot already wagered by all players: you get double
            tickets if it's under 75%, triple if it's under 50% and quadruple
            if it's under 25%.
            </span>
      },
      {
        q: 'How is the winning ticket determined?',
        a: <span>Each time all the tickets are issued the raffle ends and one
            ticket is "drawn".<br></br>
            We use <a href="http://www.oraclize.it/" target="_blank">Oraclize</a> as
            external provider for random number generation. It uses TLSNotary proof
            to ensure its service it trust-worthy, and pre-fetch the real world
            data for all the nodes within the network to achieve consensus,
            which cannot be easily done from within the Ethereum smart contract.
            </span>
      },
      {
        q: 'Does this mean SmartRaffle is provably fair?',
        a: <span>Yep.</span>
      },
      {
        q: 'How many chances to win do I have?',
        a: <span>Total tickets amount is fixed at 2500 per raffle, so
            it depends on how many tickets you get. A minimum bet with
            no bonus gives you 1/2500 aka 0.04% chance, while a maximum
            bet with 4X bonus gives you 400/2500 aka 16%!
            </span>
      },
      {
        q: 'What are the bet limits (max/min bet)?',
        a: <span>The minimum bet is 0.01 ETH. The maximum bet is usually 1 ETH
            but it can be lower if we're close to hitting the raffle limit.
            </span>
      },
      {
        q: `How can I contact you?`,
        a: <span><a href="https://t.me/smartraffle" target="_blank" className="pure-menu-link">Join our Telegram Channel to chat with us!</a></span>
      }
    ]

    return (
      <div id="faqs">
        {faqs.map((faq, index) => {
          return (
            <div className="faq" key={`faq-${index}`}>
              <div className="faq-q">{faq.q}</div>
              <div className="faq-a">{faq.a}</div>
            </div>
          )
        })}
      </div>
    )
  }
}
