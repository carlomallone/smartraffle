import React, { Component } from 'react'

export default class Splash extends Component {
  render() {
    if(this.props.networkMismatch){
      return (
        <div className="app loading">
          <div className="loader visible whitish">
            <div className="ropsten-switch" />
            <div>
              Please switch to Ropsten Network to use the app.
            </div>
          </div>
        </div>
      )
    } else {
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
  }
}
