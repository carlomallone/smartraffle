import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar pure-menu pure-menu-horizontal">
        <div className="container">
          <div className="logo">
            <i className="fas fa-ticket-alt"></i>
            <span className="light">SMART</span>
            <span className="medium">RAFFLE</span>
            <span className="network">ALPHA @ ROPSTEN NETWORK</span>
          </div>

          <div
            id="right-nav"
            className="pure-menu pure-menu-horizontal"
          >
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <a
                  href="https://t.me/smartraffle"
                  target="_blank"
                  className="pure-menu-link"
                >
                  <i className="fab fa-telegram-plane"></i>
                  Telegram
                </a>
              </li>
              <li className="pure-menu-item">
                <a
                  href="https://twitter.com/SmartRaffleCo"
                  target="_blank"
                  className="pure-menu-link"
                >
                  <i className="fab fa-twitter"></i>
                  Twitter
                </a>
              </li>
              <li className="pure-menu-item">
                <a
                  href={`https://ropsten.etherscan.io/address/${this.props.contract.address}`}
                  target="_blank"
                  className="pure-menu-link"
                >
                  <i className="fas fa-file-alt"></i>
                  Contract
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
