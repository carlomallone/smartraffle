import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        Copyright ©{new Date().getUTCFullYear()} SmartRaffle. All Rights Reserved.
        <div className="compact-logo"></div>
      </footer>
    )
  }
}
